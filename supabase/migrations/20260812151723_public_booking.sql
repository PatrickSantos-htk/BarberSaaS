-- Link público de agendamento: slug por barbearia + horário de funcionamento.
-- Leitura/escrita da parte pública (visitante sem login) acontece só pelas
-- rotas de servidor com a secret key — nenhuma policy nova de RLS é
-- necessária nas tabelas de negócio pra isso.

create extension if not exists unaccent;

alter table profiles add column if not exists slug text unique;
alter table profiles add column if not exists business_hours_start time not null default '09:00';
alter table profiles add column if not exists business_hours_end time not null default '19:00';

-- Dono pode editar o próprio slug e horário de funcionamento (mesmo padrão
-- de shop_name/pix_key/cpf_cnpj — grants são cumulativos, não substituem
-- o que já foi concedido antes).
grant update (slug, business_hours_start, business_hours_end) on profiles to authenticated;

create or replace function public.generate_slug(input_name text)
returns text
language sql
as $$
  select trim(both '-' from regexp_replace(lower(unaccent(coalesce(input_name, 'barbearia'))), '[^a-z0-9]+', '-', 'g'))
    || '-' || substr(md5(random()::text), 1, 5);
$$;

-- Contas via e-mail/senha já sabem o shop_name no cadastro e ganham slug na
-- hora. Contas via Google (sem nome ainda) ganham o slug quando preencherem
-- o nome no modal de onboarding (ver lib/auth/profile.ts, updateShopName).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, shop_name, slug, trial_ends_at, subscription_status)
  values (
    new.id,
    new.raw_user_meta_data ->> 'shop_name',
    case
      when new.raw_user_meta_data ->> 'shop_name' is not null
        then public.generate_slug(new.raw_user_meta_data ->> 'shop_name')
      else null
    end,
    now() + interval '30 days',
    'trial'
  );

  insert into public.services (name, price, duration_minutes, user_id) values
    ('Corte Simples', 40, 30, new.id),
    ('Barba', 30, 20, new.id),
    ('Combo Corte + Barba', 60, 50, new.id);

  return new;
end;
$$;

update profiles set slug = generate_slug(shop_name) where slug is null and shop_name is not null;

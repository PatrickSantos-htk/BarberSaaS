-- Trial de 30 dias + assinatura mensal via Asaas.

alter table profiles add column if not exists trial_ends_at timestamptz;
alter table profiles add column if not exists subscription_status text not null default 'trial'
  check (subscription_status in ('trial', 'active', 'past_due', 'canceled'));
alter table profiles add column if not exists cpf_cnpj text;
alter table profiles add column if not exists asaas_customer_id text;
alter table profiles add column if not exists asaas_subscription_id text;

-- Contas já existentes (criadas antes desta migration) ganham 30 dias a
-- partir de agora, já que não tinham trial_ends_at registrado.
update profiles set trial_ends_at = now() + interval '30 days' where trial_ends_at is null;

-- Todo cadastro novo (e-mail/senha ou Google) já nasce com 30 dias de teste.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, shop_name, trial_ends_at, subscription_status)
  values (new.id, new.raw_user_meta_data ->> 'shop_name', now() + interval '30 days', 'trial');

  insert into public.services (name, price, duration_minutes, user_id) values
    ('Corte Simples', 40, 30, new.id),
    ('Barba', 30, 20, new.id),
    ('Combo Corte + Barba', 60, 50, new.id);

  return new;
end;
$$;

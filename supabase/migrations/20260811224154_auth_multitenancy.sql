-- BarberSaaS — autenticação e isolamento por conta (uma conta = uma barbearia)

-- Perfil da barbearia (nome exibido no app). auth.users não é o lugar certo pra isso.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  shop_name text
);

alter table profiles enable row level security;

create policy "select own profile" on profiles
  for select using (auth.uid() = id);
create policy "update own profile" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Dono de cada registro. Default auth.uid() para os inserts do app não
-- precisarem mudar (o repositório em lib/data/*.ts continua igual).
alter table clients add column if not exists user_id uuid references auth.users (id) on delete cascade default auth.uid();
alter table services add column if not exists user_id uuid references auth.users (id) on delete cascade default auth.uid();
alter table appointments add column if not exists user_id uuid references auth.users (id) on delete cascade default auth.uid();
alter table expenses add column if not exists user_id uuid references auth.users (id) on delete cascade default auth.uid();

-- Linhas órfãs (ex.: os 3 serviços do seed inicial, criados antes de existir
-- qualquer conta) não pertencem a ninguém e ficariam invisíveis pra sempre
-- sob as novas policies — melhor removê-las agora.
delete from clients where user_id is null;
delete from services where user_id is null;
delete from appointments where user_id is null;
delete from expenses where user_id is null;

alter table clients alter column user_id set not null;
alter table services alter column user_id set not null;
alter table appointments alter column user_id set not null;
alter table expenses alter column user_id set not null;

create index if not exists idx_clients_user_id on clients (user_id);
create index if not exists idx_services_user_id on services (user_id);
create index if not exists idx_appointments_user_id on appointments (user_id);
create index if not exists idx_expenses_user_id on expenses (user_id);

-- Troca das policies abertas (Fase B, sem auth) pelas policies por dono.
drop policy if exists "allow all (sem auth ainda) - clients" on clients;
drop policy if exists "allow all (sem auth ainda) - services" on services;
drop policy if exists "allow all (sem auth ainda) - appointments" on appointments;
drop policy if exists "allow all (sem auth ainda) - expenses" on expenses;

create policy "owner full access - clients" on clients
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner full access - services" on services
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner full access - appointments" on appointments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner full access - expenses" on expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Toda vez que uma conta nova é criada (e-mail/senha ou Google), cria o
-- perfil (nome vem dos metadados do cadastro, quando existir) e semeia os
-- 3 serviços padrão pra essa barbearia — mesma massa de dados inicial do
-- roteiro original, agora isolada por conta.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, shop_name)
  values (new.id, new.raw_user_meta_data ->> 'shop_name');

  insert into public.services (name, price, duration_minutes, user_id) values
    ('Corte Simples', 40, 30, new.id),
    ('Barba', 30, 20, new.id),
    ('Combo Corte + Barba', 60, 50, new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- BarberSaaS — schema inicial (clientes, serviços, agendamentos, despesas)

create extension if not exists "pgcrypto";

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null default '',
  created_at date not null default current_date
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null check (price > 0),
  duration_minutes integer not null check (duration_minutes > 0)
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  service_id uuid not null references services (id) on delete restrict,
  date date not null,
  time time not null,
  price numeric(10, 2) not null check (price > 0),
  status text not null default 'PENDING'
    check (status in ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED')),
  payment_status text not null default 'UNPAID'
    check (payment_status in ('UNPAID', 'PAID')),
  payment_method text
    check (payment_method is null or payment_method in ('PIX', 'CARTAO', 'DINHEIRO'))
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category text not null,
  amount numeric(10, 2) not null check (amount > 0),
  date date not null
);

-- Índices de busca por data e status (agenda, dashboard, relatórios).
create index if not exists idx_appointments_date on appointments (date);
create index if not exists idx_appointments_status on appointments (status);
create index if not exists idx_appointments_date_status on appointments (date, status);
create index if not exists idx_expenses_date on expenses (date);

-- RLS ligado em todas as tabelas. Como o app ainda não tem autenticação de
-- usuário (dono único da barbearia, sem login), liberamos acesso total via
-- a chave anon por enquanto. Quando entrar login/multi-tenant, trocar essas
-- policies por regras que filtrem por usuário/barbearia dona do registro.
alter table clients enable row level security;
alter table services enable row level security;
alter table appointments enable row level security;
alter table expenses enable row level security;

create policy "allow all (sem auth ainda) - clients" on clients
  for all using (true) with check (true);
create policy "allow all (sem auth ainda) - services" on services
  for all using (true) with check (true);
create policy "allow all (sem auth ainda) - appointments" on appointments
  for all using (true) with check (true);
create policy "allow all (sem auth ainda) - expenses" on expenses
  for all using (true) with check (true);

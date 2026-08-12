-- Habilita o Supabase Realtime (Postgres Changes) nas tabelas de agendamentos
-- e clientes, para que uma solicitação criada pelo link público apareça na
-- agenda do dono sem precisar recarregar a página.
alter publication supabase_realtime add table public.appointments;
alter publication supabase_realtime add table public.clients;

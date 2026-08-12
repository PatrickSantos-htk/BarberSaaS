-- A migration anterior (20260812134256) não funcionou: o Postgres concede
-- UPDATE na tabela inteira pro papel authenticated por padrão, e um REVOKE
-- por coluna não remove essa permissão de tabela já existente. Testado e
-- confirmado que o "furo" continuava aberto.
--
-- Correção correta: revogar o UPDATE da tabela inteira e conceder de volta
-- só nas colunas que o próprio dono pode editar. As colunas de assinatura
-- (subscription_status, trial_ends_at, asaas_customer_id,
-- asaas_subscription_id) ficam de fora — só as rotas de servidor (com a
-- secret key) conseguem escrever nelas.
revoke update on profiles from authenticated;
grant update (shop_name, pix_key, cpf_cnpj) on profiles to authenticated;

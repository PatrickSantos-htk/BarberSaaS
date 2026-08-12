-- Vencimento de pagamento por agendamento (separado da data do atendimento)
-- e chave PIX da barbearia (usada na mensagem de cobrança via WhatsApp).

alter table appointments add column if not exists payment_due_date date;

alter table profiles add column if not exists pix_key text;

-- A policy de update de profiles é por linha (dono só edita a própria linha),
-- não por coluna — sem isto, o dono poderia setar subscription_status='active'
-- nele mesmo direto pelo console do navegador, sem pagar nada. As colunas de
-- assinatura só devem ser escritas pelas nossas rotas de servidor (que usam a
-- secret key, não a sessão do usuário).
revoke update (subscription_status, trial_ends_at, asaas_customer_id, asaas_subscription_id)
  on profiles from authenticated;

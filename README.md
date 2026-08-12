# BarberSaaS

Plataforma de gestão para barbearias: agenda, clientes, serviços, financeiro,
cobrança via WhatsApp e assinatura mensal com teste grátis de 30 dias.
Multi-tenant — cada barbearia tem sua própria conta e só enxerga os próprios
dados.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** — tema "Editorial Premium" (carvão + acento petróleo),
  claro/escuro
- **Supabase** — banco de dados (Postgres + RLS) e autenticação (e-mail/senha
  e Google)
- **Zustand** — estado do app no navegador, hidratado a partir do Supabase
- **Asaas** — processador de pagamento da assinatura mensal (PIX + cartão)

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Sem as variáveis de
ambiente abaixo configuradas, o app não sobe (a conexão com o Supabase é
obrigatória).

### 1. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

| Variável | Onde conseguir | Obrigatória para |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Tudo |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API Keys → Publishable key | Tudo |
| `SUPABASE_SECRET_KEY` | Supabase → Settings → API Keys → Secret keys | Assinatura (rota `/api/subscribe` e o webhook) |
| `ASAAS_API_URL` | `https://api-sandbox.asaas.com/v3` (testes) ou `https://api.asaas.com/v3` (produção) | Assinatura |
| `ASAAS_API_KEY` | Asaas → Configurações → Integrações → Chave de API | Assinatura |
| `ASAAS_WEBHOOK_TOKEN` | Inventado por você, configurado também no webhook da Asaas | Confirmação automática de pagamento |

`SUPABASE_SECRET_KEY` e `ASAAS_API_KEY` nunca devem ser expostas no cliente
nem versionadas — são lidas apenas em Route Handlers server-side
(`lib/supabase/admin.ts`, `lib/asaas/client.ts`).

### 2. Migrations do banco

As migrations ficam em `supabase/migrations/`, em ordem cronológica. Aplique
todas, na ordem, pelo **SQL Editor** do Supabase (ou via `supabase db push`
se estiver com o CLI logado):

1. `init_schema` — tabelas `clients`, `services`, `appointments`, `expenses`
2. `auth_multitenancy` — login, `profiles`, isolamento por conta (RLS)
3. `payment_due_date` — vencimento de pagamento por agendamento + chave PIX
4. `subscriptions` — trial de 30 dias e campos de assinatura
5. `lock_subscription_columns` + `lock_subscription_columns_fix` — trava as
   colunas de assinatura pra só serem editáveis pelas rotas de servidor

## Estrutura

```
app/
  (auth)/          -- login, cadastro (sem sidebar)
  (dashboard)/      -- agenda, clientes, serviços, financeiro, painel, configurações
  api/              -- rotas de servidor (assinatura, webhook da Asaas)
  assinatura/       -- tela de assinar (fora do grupo do dashboard, sempre acessível)
components/
  ui/               -- primitivos de design (Button, Card, Modal, ...)
  layout/           -- Sidebar, Topbar, navegação
  agenda/ clients/ services/ finance/ dashboard/ auth/ onboarding/
lib/
  data/             -- repositório por entidade (Supabase por trás)
  auth/             -- sessão, perfil, assinatura
  supabase/         -- clientes Supabase (browser, admin, middleware)
  asaas/            -- integração com a API da Asaas
  whatsapp.ts       -- geração de links wa.me pra cobrança manual
supabase/
  migrations/       -- schema do banco, em ordem
```

## Status atual

**Pronto:**
- Agenda (dia/semana), clientes, serviços, financeiro, dashboard com KPIs
- Login/cadastro (e-mail+senha e Google), multi-tenant com isolamento por RLS
- Cobrança manual via link do WhatsApp (com chave PIX configurável)
- Trial de 30 dias + assinatura mensal via Asaas (criação de cobrança testada
  em sandbox e produção)

**Pendente:**
- Deploy do app (necessário pra o webhook da Asaas funcionar de verdade —
  hoje só roda em `localhost`)
- Confirmação automática de pagamento (webhook) — código pronto, falta testar
  com o app publicado
- Automação de WhatsApp (confirmação D-1, leitura de resposta do cliente) —
  fora de escopo por enquanto, decidimos pelo link manual (`wa.me`) primeiro
- Página pública de agendamento pro cliente final

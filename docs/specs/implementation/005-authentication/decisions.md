# Decisões Arquiteturais — Feature 005

## 1. Utilização do Supabase SSR para Gerenciamento de Sessões

- **Decisão**: A autenticação do Google OAuth 2.0 utilizará o Supabase Auth com clientes SSR nativos do monorepo.
- **Justificativa**: Evita a inclusão de bibliotecas de autenticação concorrentes (como NextAuth/Auth.js puro) que exigiriam o gerenciamento paralelo de cookies de sessão, mantendo a consistência do ecossistema e aproveitando o Middleware do Supabase já configurado.

## 2. Delegação dos Escopos do Google Calendar no OAuth Inicial

- **Decisão**: Solicitar os escopos adicionais de escrita no Google Calendar no início do consentimento ou através de um fluxo dedicado de re-autenticação.
- **Justificativa**: Garante que o administrador não precise autenticar duas vezes se ele já consentir os escopos de calendário na primeira autenticação. Caso ele opte por não conceder no início, o banner interativo de alerta no dashboard garantirá que ele possa reconectar sem quebrar a navegação da aplicação.

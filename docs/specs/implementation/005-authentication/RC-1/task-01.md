# Task 01 — Configuração e Fluxo de Autenticação Google OAuth via Supabase

# Objetivo

Configurar a integração de login social do Google OAuth 2.0 no Supabase Auth e implementar a Server Action para disparar o login no Next.js (RSC/SSR).

# Escopo

- Integração da autenticação do Supabase com o Provider da Google.
- Implementação de um botão "Entrar com Google" no formulário de login (`/login`).
- Configuração de escopos mínimos (e-mail, perfil, openid) para a requisição inicial.
- Redirecionamento seguro para a URL de callback e `/admin/dashboard` pós-login.

# Dependências

Nenhuma.

# Critérios de Aceite

- [ ] No painel do Supabase, o Google OAuth está habilitado e configurado com Client ID e Client Secret corretos.
- [ ] O botão de login realiza chamada à action de sign-in do Supabase, redirecionando o usuário para a tela de contas do Google.
- [ ] URLs de redirecionamento (redirectUrl) estão parametrizadas usando as variáveis de ambiente locais do Next.js.
- [ ] Um cookie temporário do Supabase (`sb-access-token` / `sb-refresh-token`) é criado após autenticação bem-sucedida.

# Critérios de Homologação

1. Acessar `/login` e clicar no botão "Entrar com Google".
2. Confirmar o redirecionamento para o domínio do Google (`accounts.google.com`).
3. Concluir o login com uma conta Google ativa.
4. Validar o redirecionamento de volta para o Dashboard administrativamente protegido.

# Evidências Esperadas

- Botão "Entrar com Google" renderizado na tela de login.
- Presença dos cookies de sessão no console de desenvolvedor do navegador.
- Logs de autenticação registradores no Supabase Auth Dashboard.

# Task 04 — Persistência, Tratamento de Erros e Expiração do Token

# Objetivo

Garantir o fluxo de refresh automático da sessão administrativa via Supabase SSR e gerenciar telas de erro para falhas de rede ou tokens inválidos/expirados.

# Escopo

- Middleware Next.js executando `supabase.auth.getUser()` para renovação automática (refresh token).
- Componente de barreira visual / página de erro (`/auth/error`) para capturar falhas no callback do OAuth.
- Tratamento de expiração de sessão redirecionando para `/login?error=session_expired`.

# Dependências

- Task 01 e Task 02.

# Critérios de Aceite

- [ ] O token JWT é renovado de forma transparente sem forçar logout do administrador ativo.
- [ ] Qualquer erro no redirecionamento do Google OAuth é capturado pela página de erro, evitando loops ou telas brancas.
- [ ] Cookies expirados são limpos e redirecionam o usuário de forma amigável à página de login.

# Critérios de Homologação

1. Modificar artificialmente o tempo de expiração do cookie de sessão ou simular token inválido.
2. Atualizar a página `/admin/dashboard` e verificar se a sessão tenta ser renovada.
3. Se falhar, confirmar o redirecionamento automático para a tela de login apresentando a mensagem de erro adequada.

# Evidências Esperadas

- Rota `/auth/error` funcional exibindo a causa tratada do erro.
- Atualização transparente dos cookies visível na aba network do desenvolvedor.

# Task 03 — Fluxo de Logout e Invalidação de Sessão

# Objetivo

Implementar o botão e a Server Action para encerrar a sessão do usuário administrativo, destruindo cookies e tokens locais e invalidando a sessão no Supabase Auth.

# Escopo

- Botão "Sair" integrado na barra superior do painel administrativo.
- Server Action para execução do `signOut()` no Supabase Client (SSR).
- Redirecionamento automático pós-logout para a rota pública `/login`.

# Dependências

- Task 01 (Configuração da sessão de login)

# Critérios de Aceite

- [ ] O clique em "Sair" dispara o estado de loading e desabilita novas interações.
- [ ] A sessão é destruída no servidor do Supabase.
- [ ] Cookies locais de autenticação do Supabase são inteiramente removidos do navegador.
- [ ] O usuário é redirecionado para `/login` e tentativas de voltar no histórico são bloqueadas pelo Middleware.

# Critérios de Homologação

1. No painel `/admin/dashboard`, clicar no botão "Sair".
2. Confirmar o carregamento e o redirecionamento imediato para a página `/login`.
3. Tentar acessar `/admin/dashboard` diretamente pela barra de endereços e confirmar o bloqueio de segurança.

# Evidências Esperadas

- Botão de logout renderizado com feedback de loading visual.
- Remoção completa de cookies (`sb-*`) após o clique.

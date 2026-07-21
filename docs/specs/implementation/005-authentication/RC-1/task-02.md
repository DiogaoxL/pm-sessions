# Task 02 — Verificação de Autorização e Role Admin

# Objetivo

Validar se o e-mail retornado pela autenticação do Google pertence a um administrador autorizado listado no banco de dados e aplicar o guard no Middleware.

# Escopo

- Middleware interceptando requisições em `/admin/*`.
- Consulta à tabela `public.admins` comparando o `auth_user_id` ou o `email` da sessão ativa.
- Redirecionamento de usuários logados mas não autorizados para `/?error=forbidden`.

# Dependências

- Task 01 (Autenticação Google OAuth ativada)

# Critérios de Aceite

- [ ] O middleware extrai o usuário atual do Supabase Auth.
- [ ] Usuários logados sem registro na tabela `public.admins` são bloqueados.
- [ ] Usuários com role incompatível são redirecionados.
- [ ] Administradores autorizados com role `admin` ou `super_admin` têm acesso liberado.

# Critérios de Homologação

1. Autenticar-se com uma conta Google que NÃO está cadastrada na tabela `public.admins`.
2. Verificar o redirecionamento automático para a raiz `/` com o parâmetro `?error=forbidden`.
3. Adicionar o e-mail da conta de teste na tabela `admins` e tentar acessar `/admin/dashboard` novamente.
4. Confirmar que o acesso foi liberado com sucesso.

# Evidências Esperadas

- Log de auditoria `console.warn` no Middleware informando a negação de acesso para e-mails não autorizados.
- Registro correspondente na tabela `public.admins` vinculando o `auth_user_id`.

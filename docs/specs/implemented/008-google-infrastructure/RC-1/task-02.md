# Task 02: Provisionamento de Credenciais OAuth & Geração do Refresh Token Offline

# Objetivo

Gerar as credenciais OAuth 2.0 do Google Cloud e executar o fluxo de autorização offline para obter o token de atualização (`GOOGLE_REFRESH_TOKEN`) de longa duração.

# Escopo

- **Credenciais Web Client**:
  - Criar credencial do tipo ID do Cliente OAuth 2.0 (Tipo: Aplicativo da Web).
  - Cadastrar as origens JavaScript autorizadas (localhost e Vercel).
  - Cadastrar as URIs de redirecionamento autorizadas para autenticação (`/auth/callback`).
  - Copiar o Client ID e Client Secret.
- **Obtenção do Refresh Token**:
  - Disparar a rota de autenticação administrativa configurando explicitamente `access_type: 'offline'` e `prompt: 'consent'`.
  - Concluir o login no consentimento e interceptar o refresh token gerado no callback de sucesso.

# Dependências

- Task 01.

# Critérios de Aceite

- [ ] ID de Cliente OAuth 2.0 criado com tipo Aplicativo da Web.
- [ ] URIs de redirecionamento configuradas exatamente para os ambientes correspondentes.
- [ ] Concessão de consentimento administrativo finalizada e `GOOGLE_REFRESH_TOKEN` de longa duração obtido.

# Critérios de Homologação

1. Verificar no painel de Credenciais do GCP se o ID e Secret estão ativos.
2. Iniciar o fluxo de autenticação e verificar se a tela do Google exibe a solicitação de permissão permanente (offline).
3. Testar a validade do refresh token obtido disparando uma chamada teste à API de tokens e validando o retorno do access token com HTTP 200.

# Evidências Esperadas

- Client ID e Client Secret gerados.
- Refresh token gerado e armazenado.

# Observações

O token de atualização obtido deve ser mantido em segredo e será injetado nas variáveis de ambiente na próxima task.

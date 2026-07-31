# Feature

**RC-008 — Google Infrastructure Integration**

Objetivo: Preparar e validar toda a infraestrutura e credenciais do Google Workspace em ambiente de produção real (Vercel), integrando de ponta a ponta a geração de videoconferências no Google Meet e o agendamento de eventos no Google Calendar.

---

# Estratégia de Implementação

A estratégia baseia-se em uma abordagem híbrida de execução (50% do operador humano e 50% automatizada pelo agente):

1. **Provisionamento**: Configurar a estrutura básica de APIs do Google Cloud de forma isolada.
2. **Autenticação de Longa Duração**: Obter credenciais OAuth e realizar o fluxo de consentimento offline para extração e persistência do `Refresh Token`.
3. **Parametrização**: Injetar as variáveis secretas na Vercel e disparar testes de fumaça (smoke tests) para validar a sincronização ativa com o banco.

A implementação é incremental, garantindo que a infraestrutura local permaneça operacional e que o banco de dados sirva como fallback seguro em caso de indisponibilidade das APIs do Google.

---

# Ordem Recomendada

1. **Task 01**: Configuração do Projeto GCP e Consentimento OAuth
2. **Task 02**: Provisionamento de Credenciais OAuth & Geração do Refresh Token Offline
3. **Task 03**: Parametrização e Sincronização em Produção (Vercel Env Setup)

---

# Tasks

## Task 01 — Configuração do Projeto GCP e Consentimento OAuth

### Objetivo

Provisionar a estrutura inicial de serviços e permissões no console do Google Cloud Platform para suporte à integração com Google Calendar e Google Meet.

### Escopo

- Criação de um projeto dedicado no GCP (`PM Sessions Prod`).
- Habilitação das APIs do Google Calendar e Google Meet.
- Configuração da tela de consentimento OAuth (definição do escopo das permissões para `/auth/calendar` e `/auth/calendar.events`).

### Dependências

- Conclusão das especificações aprovadas da Sprint 2.

### Critérios de Aceite

- [ ] Projeto `PM Sessions Prod` criado e ativo no GCP Console.
- [ ] APIs do Google Calendar e Google Meet habilitadas.
- [ ] Escopos mínimos de permissão (`.../auth/calendar` e `.../auth/calendar.events`) declarados na tela de consentimento.

---

## Task 02 — Provisionamento de Credenciais OAuth & Geração do Refresh Token Offline

### Objetivo

Obter as credenciais da API do Google Cloud e capturar de forma segura o token de atualização de longa duração (`GOOGLE_REFRESH_TOKEN`) para habilitar sincronizações em background.

### Escopo

- Geração das credenciais de ID do cliente OAuth 2.0 (Tipo: Aplicativo da Web) no GCP.
- Configuração de URIs autorizados de redirecionamento (localhost e Vercel).
- Execução do fluxo de consentimento administrativo local configurado com `access_type: 'offline'` para capturar o refresh token no callback de autenticação.

### Dependências

- Task 01.

### Critérios de Aceite

- [ ] Client ID e Client Secret gerados com sucesso.
- [ ] URIs de redirecionamento autorizadas apontando para `https://<seu-dominio-prod>.vercel.app/auth/callback` e `http://localhost:3000/auth/callback`.
- [ ] Execução bem-sucedida do fluxo de autenticação capturando um `GOOGLE_REFRESH_TOKEN` válido e testado contra a API do Google (retornando HTTP 200).

---

## Task 03 — Parametrização e Sincronização em Produção (Vercel Env Setup)

### Objetivo

Injetar as credenciais finais no ambiente de hospedagem produtivo e validar a integração do agendamento de ponta a ponta com a geração de videoconferências no Meet.

### Escopo

- Configuração das variáveis de ambiente na Vercel (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`).
- Execução do Re-deploy da aplicação em produção.
- Execução de testes de fumaça (smoke tests) para validar que inscrições na página pública geram reuniões no Meet e eventos na agenda do host de produção.

### Dependências

- Task 02.

### Critérios de Aceite

- [ ] Environment Variables ativas na Vercel sem vazamento de logs.
- [ ] Deploy executado com sucesso e URLs acessíveis.
- [ ] Inscrição de teste realizada na página pública gerando evento e sala do Meet correspondentes na conta Google de produção.
- [ ] Horários bloqueados na agenda do host refletindo na listagem pública do PM Sessions em até 3 segundos.

---

# Riscos

- **Expiração de Refresh Token**: O token gerado pode expirar se a tela de consentimento for mantida em modo Sandbox/External por inatividade. A mitigação é publicar o app no GCP Console.
- **Divergência de Timezone**: Eventos criados em produção podem registrar fusos horários incorretos se as variáveis de ambiente locais e do banco não estiverem sincronizadas.
- **Erros de Redirect URI**: Travamento do fluxo administrativo caso a URL registrada no GCP não coincida exatamente com o domínio da Vercel.

---

# Observações

- A execução destas tasks exige que o operador humano forneça os dados de credenciais em etapas intermediárias.
- Não devem ser criados novos arquivos de código; as tasks operacionais e de validação devem usar a base de serviços existente.

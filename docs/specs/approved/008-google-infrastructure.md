# RC-008 — Google Infrastructure Integration

> Especificação da integração de infraestrutura com o Google Workspace em ambiente de produção.

---

# Status

🟢 Approved

---

# Objetivo

Esta Release Candidate tem como finalidade preparar o PM Sessions para operação em produção através da integração completa com a infraestrutura Google Workspace (Google Calendar, Google Meet e fluxos OAuth).

---

# Problema

Atualmente:

- Google Calendar e Google Meet funcionam apenas parcialmente e em modo de desenvolvimento local;
- Ainda não existe homologação em ambiente real de produção da infraestrutura Google;
- O fluxo OAuth administrativo depende de configuração e intervenções manuais constantes;
- O painel da Vercel não possui todas as credenciais e variáveis de ambiente definitivas;
- A sincronização automática e o tratamento de falhas da API não estão validados em ambiente real.

---

# Escopo

Esta Specification contempla:

### Google Cloud

- Ativação das APIs necessárias (`Calendar` e `Meet`);
- Parametrização da tela de consentimento OAuth corporativo/institucional;
- Configuração de credenciais Web Client seguras;
- Geração e renovação offline de `GOOGLE_REFRESH_TOKEN` de longa duração.

### Google Calendar

- Criação, edição, sincronização (FreeBusy) e cancelamento de eventos na agenda primária dos hosts organizadores.

### Google Meet

- Geração automática e dinâmica de links de conferência integrados ao evento;
- Distribuição dos links do Meet nos convites enviados aos participantes.

### Vercel

- Criptografia e injeção de segredos (`Environment Variables`).

### Homologação

- Testes de stress de concorrência e integridade das chaves em ambiente de staging e produção.

---

# Fora do Escopo

Esta Specification não contempla:

- Exportação de dados para planilhas (Export CSV);
- Modificações de layout de telas, formulários ou componentes React;
- Novas funcionalidades do Dashboard administrativo ou do fluxo público de candidatos;
- Refatorações de regras de negócios ou reestruturação de tabelas no banco de dados.

---

# Dependências

Esta Release Candidate depende da conclusão de:

- RC-006 (Admin Management UI)
- RC-007 (Public Participant Flow)

Esta Release Candidate antecede:

- RC-009 (Deploy & Production Hardening)

---

# Critérios de Aceite

A RC-008 será considerada concluída quando:

- Projeto no GCP criado e APIs de Calendar e Meet ativadas;
- Tela de consentimento OAuth configurada e publicada;
- ID do cliente OAuth e segredos gerados para produção;
- Refresh token de longa duração obtido de forma offline;
- Agendamentos públicos inserindo eventos no Calendar e gerando links do Meet com sucesso;
- Envio de convites aos participantes funcionando sem erros no console;
- Atualizações e cancelamentos de slots sincronizando dinamicamente na agenda;
- Configurações da Vercel validadas;
- Build, Lint e Testes unitários rodando 100% verdes.

---

# Riscos

- **Expiração de Refresh Token (External Sandbox)**: Expiração automática do token a cada 7 dias caso mantido em modo Sandbox no GCP Console.
- **Limites e Cotas da API Google**: Riscos de bloqueio por spam ou excesso de requisições concorrentes.
- **Incompatibilidade de Redirect URIs**: Erro `redirect_uri_mismatch` em redirecionamento de produção do Next.js.
- **Configurações de rede na Vercel**: Variáveis de ambiente incorretas impedindo conexões com o Supabase.

---

# Responsabilidades (Execução Híbrida)

Esta release candidate possui uma natureza mista de implantação:

### Operador (Humano) — 50%

- Provisionamento do projeto no Google Cloud Platform;
- Configuração da tela de consentimento, escopos e credenciais OAuth;
- Execução do fluxo administrativo local/manual para capturar o Refresh Token inicial;
- Cadastro de variáveis de ambiente no dashboard da Vercel.

### Agente (AI) — 50%

- Escrita de scripts de automação ou teste de conexões;
- Auditoria de segurança de credenciais;
- Execução da suíte de testes de não-regressão;
- Validação automática de integridade e homologação técnica da integração;
- Sincronização documental.

---

# Definition of Done

A Release Candidate será considerada encerrada quando:

- Toda a infraestrutura Google estiver operacional no ambiente de produção;
- A integração Google Calendar e Meet estiver totalmente validada de ponta a ponta sem falhas de autenticação;
- A documentação de progresso, decisões, riscos e walkthrough estiver devidamente sincronizada;
- O ambiente estiver pronto para o deploy e hardening final (RC-009).

# Task 01: Configuração do Projeto GCP e Consentimento OAuth

# Objetivo

Provisionar a estrutura inicial de serviços, APIs e escopos de permissões no console do Google Cloud Platform (GCP) para viabilizar a comunicação com os calendários e geração de salas do Meet.

# Escopo

- **Criação do Projeto**: Criar um projeto isolado no Google Cloud Console com o nome `PM Sessions Prod`.
- **Habilitação de APIs**:
  - Habilitar a API do Google Calendar (`Google Calendar API`).
  - Habilitar a API do Google Meet (`Google Meet API`) se for necessário o provisionamento isolado.
- **Tela de Consentimento OAuth**:
  - Configurar as informações básicas da tela de consentimento (Logo, App Name, E-mails de suporte).
  - Definir o escopo mínimo de permissões:
    - `https://www.googleapis.com/auth/calendar`
    - `https://www.googleapis.com/auth/calendar.events`
  - Definir o User Type (Internal para organizações institucionais, External para Sandbox/Gmail comum).

# Dependências

- Conclusão das especificações da Sprint 2.

# Critérios de Aceite

- [ ] Projeto `PM Sessions Prod` ativo no GCP Console.
- [ ] APIs de Calendar e Meet habilitadas e ativas para requisições.
- [ ] Tela de consentimento OAuth criada com os escopos `calendar` e `calendar.events` atrelados.

# Critérios de Homologação

1. Acessar o GCP Console e validar se o projeto selecionado é o correto.
2. Ir na aba de APIs habilitadas e verificar a presença ativa da `Google Calendar API`.
3. Acessar a tela de consentimento OAuth e validar que ela exibe os escopos de escrita e leitura de calendário.

# Evidências Esperadas

- Projeto GCP configurado.
- APIs de integração ativas.
- Tela de consentimento configurada no console.

# Observações

Esta task é exclusivamente administrativa e deve ser executada pelo operador humano no GCP Console.

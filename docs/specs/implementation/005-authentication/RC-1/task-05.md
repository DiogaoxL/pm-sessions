# Task 05 — Tratamento de Escopos Google Calendar e Reconexão

# Objetivo

Garantir que a autenticação inicial ou o fluxo de reconexão do administrador solicite os escopos adicionais necessários de gravação no Google Calendar (`https://www.googleapis.com/auth/calendar` e `https://www.googleapis.com/auth/calendar.events`).

# Escopo

- Configuração dos query parameters de escopo na chamada inicial do OAuth.
- Validação no painel administrativo se o administrador autenticado concedeu o consentimento para os escopos de escrita na agenda.
- Exibição de banner de aviso na tela com botão de ação para "Reconectar conta Google" caso as permissões tenham sido revogadas.

# Dependências

- Task 01.

# Critérios de Aceite

- [ ] A tela de consentimento do Google OAuth detalha de forma explícita a permissão de ler e escrever eventos da agenda.
- [ ] O sistema detecta a ausência do token ou escopo adequado no callback e armazena de forma segura.
- [ ] Caso a permissão seja revogada nas configurações da conta Google do usuário, o dashboard exibe um alerta solicitando reconexão.

# Critérios de Homologação

1. Autenticar com a conta administrativa desmarcando a caixa de consentimento de acesso à agenda na tela do Google.
2. Acessar o Dashboard e constatar a renderização de um banner vermelho de alerta de permissão em falta.
3. Clicar no botão "Reconectar" e completar o fluxo concedendo as permissões. O banner de aviso deve desaparecer.

# Evidências Esperadas

- Banner de alerta visual renderizado dinamicamente no topo do painel administrativo.
- Chamada do OAuth com o parâmetro `scopes` incluindo as URLs do Google Calendar.

# Decisões de Infraestrutura — RC-008

Este documento registra as decisões estratégicas acordadas para a infraestrutura de integrações com o Google Workspace.

## 1. Escopos do OAuth 2.0

- **Decisão**: Utilizar os escopos `https://www.googleapis.com/auth/calendar` e `https://www.googleapis.com/auth/calendar.events`.
- **Justificativa**: Garante o controle total necessário para consultar disponibilidade (FreeBusy) e gerenciar (criar, atualizar e excluir) eventos de mentoria na agenda do host.

## 2. Abordagem de OAuth Offline (Refresh Token)

- **Decisão**: Configurar a requisição OAuth com `access_type: 'offline'` e `prompt: 'consent'` durante o primeiro login administrativo do organizador.
- **Justificativa**: Permite que o servidor Next.js obtenha um token de longa duração (`GOOGLE_REFRESH_TOKEN`). Isso possibilita a renovação do `Access Token` em background para consultas na página pública, sem exigir logins repetitivos.

## 3. Utilização de Agenda Primária (primary)

- **Decisão**: Utilizar a string `'primary'` como `GOOGLE_CALENDAR_ID` nas variáveis de ambiente.
- **Justificativa**: Simplifica a integração, vinculando automaticamente os convites e consultas ao calendário principal associado à conta autenticada do host.

## 4. Geração Automática de Links do Meet

- **Decisão**: Passar a diretiva `conferenceDataVersion: 1` e a estrutura de `createRequest` com `requestId` único na criação do evento via API.
- **Justificativa**: Força o Google Calendar a criar e anexar automaticamente uma sala de conferência do Google Meet para cada agendamento feito pelo participante, sem necessidade de lógica de vídeo adicional no backend.

## 5. Escopos do GCP Consent Mode: Internal vs External

- **Decisão**: Recomendar a configuração da tela de consentimento como **External** no GCP se os mentores utilizarem contas de e-mail comuns (Gmail), ou **Internal** se todos utilizarem contas institucionais vinculadas à mesma organização do Google Workspace.
- **Justificativa**: Evita a necessidade de auditoria e verificação de aplicativo de segurança avançada do Google caso o app seja de uso estritamente corporativo ou interno.

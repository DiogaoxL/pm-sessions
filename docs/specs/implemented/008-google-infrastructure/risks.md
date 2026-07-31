# Matriz de Riscos & Mitigações — RC-008

Este documento cataloga os potenciais riscos associados à integração de infraestrutura Google Workspace e os respectivos planos de contingência.

---

## 1. Expiração do Refresh Token em Ambiente de Teste (External Sandbox)

- **Descrição**: Se o projeto do GCP estiver em modo de publicação _"Teste (Sandbox)"_, o `GOOGLE_REFRESH_TOKEN` expira automaticamente após 7 dias de inatividade.
- **Impacto**: O agendamento público irá falhar ou reverter para a disponibilidade local do banco de dados, acusando erro de renovação de token no servidor.
- **Mitigação**:
  - Mover o status de publicação do OAuth Consent Screen de _"Teste"_ para _"Produção"_ no GCP Console. Isso remove a expiração de 7 dias, mesmo que o aplicativo não esteja verificado pelo Google.
  - Alternativamente, configurar o consentimento como **Internal** caso a organização use o Google Workspace corporativo.

---

## 2. Limite de Criação de Eventos por Usuário (Rate Limits)

- **Descrição**: O Google Calendar API impõe limites de cota para chamadas rápidas ou criação em lote de eventos para evitar spam.
- **Impacto**: Falha pontual ao realizar inscrições sequenciais excessivas.
- **Mitigação**:
  - Implementar um mecanismo de retry exponencial no serviço de agendamento caso a API retorne erro HTTP `429 (Too Many Requests)`.
  - O código do PM Sessions reverte para a disponibilidade do banco em caso de erro, garantindo que o candidato consiga se cadastrar localmente mesmo com a API do Google indisponível temporariamente.

---

## 3. Falha na Geração do Link do Google Meet

- **Descrição**: Em contas Google pessoais comuns, a criação de eventos via API pode ocasionalmente falhar em anexar o link de videoconferência se a política de segurança da conta bloquear APIs de terceiros.
- **Impacto**: O participante recebe o convite no calendário, mas o e-mail não contém o link do Meet para a reunião online.
- **Mitigação**:
  - A Server Action de agendamento deve checar se a API retornou o campo `meetUrl`. Se estiver nulo, enviar uma notificação de fallback ou exibir um status claro `"aguardando configuração"` na interface administrativa para que o host anexe o link manualmente se necessário.

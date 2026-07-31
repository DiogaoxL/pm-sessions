# Decisions — 002 Google Calendar

[← Voltar para Feature](README.md)

---

# Histórico de Decisões

| Data       | Título                             | Decisão                                                                                                                    | Racional                                                                                                                                                    | Consequência                                                                 |
| :--------- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| 2026-07-20 | Setup da Integração com Google API | Utilizar o SDK oficial do Google (`googleapis`) e autenticação via OAuth/Service Account (conforme escopo administrativo). | Garante estabilidade, conformidade com os padrões do Google e tipagem nativa robusta.                                                                       | Inicialização centralizada do cliente API do Google no módulo de integração. |
| 2026-07-20 | Fluxo de Leitura Antes de Escrita  | Implementar a consulta de disponibilidade (FreeBusy) antes da lógica de persistência de eventos.                           | Permite que o agendamento no PM Sessions use a disponibilidade em tempo real da agenda do Google Calendar como fonte de verdade antes de efetivar reservas. | Criação da Task 02 dedicada exclusivamente à leitura de horários livres.     |

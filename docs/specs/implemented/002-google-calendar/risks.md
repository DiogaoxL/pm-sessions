# Risks — 002 Google Calendar

[← Voltar para Feature](README.md)

---

# Histórico de Riscos e Mitigações

| Risco                                            | Impacto | Probabilidade | Mitigação                                                                                                                  | Status    |
| :----------------------------------------------- | :------ | :------------ | :------------------------------------------------------------------------------------------------------------------------- | :-------- |
| **Excesso de requisições / Rate limits da API**  | Médio   | Média         | Implementar checagem de concorrência local, cache temporário de disponibilidade e operações idempotentes.                  | Planejado |
| **Expiração e invalidação de credenciais OAuth** | Alto    | Baixa         | Armazenamento seguro de refresh tokens com renovação automática pré-chamada.                                               | Planejado |
| **Eventos duplicados por retentativas**          | Alto    | Média         | Armazenar o `google_event_id` no banco de dados e checar sua presença antes de disparar requisições de criação de eventos. | Planejado |

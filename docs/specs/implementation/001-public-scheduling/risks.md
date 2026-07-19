# Risks — 001 Public Scheduling

[← Voltar para Feature](README.md)

---

| Risco                                                      | Probabilidade | Impacto | Mitigação                                                                                                                           | Status     |
| ---------------------------------------------------------- | ------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Rate Limit ou indisponibilidade da API do Google Calendar  | Média         | Alto    | Rollback transacional decrementando participantes e excluindo registro local                                                        | Ativo      |
| Latência alta no salvamento de reservas                    | Média         | Médio   | Feedback imediato na tela de loading/skeletons para o candidato                                                                     | Ativo      |
| Acoplamento excessivo com API proprietária do Supabase SDK | Baixa         | Médio   | [Mitigado via Task 02] Definição de interfaces desacopladas (`ITimeSlotRepository`, `ISessionRepository`, `IParticipantRepository`) | Mitigado   |
| Falha na interpretação de fuso horário (America/Sao_Paulo) | Média         | Médio   | Uso explícito de `Intl.DateTimeFormat` com fuso forçado e logs de data/hora no servidor.                                            | Monitorado |
| Complexidade/sintaxe dos filtros `.or()` do Supabase SDK   | Baixa         | Médio   | Validação estática nos testes de integração locais da camada de repositório.                                                        | Monitorado |

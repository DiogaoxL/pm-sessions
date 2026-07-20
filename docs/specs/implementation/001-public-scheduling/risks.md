# Risks — 001 Public Scheduling

[← Voltar para Feature](README.md)

---

| Risco                                                         | Probabilidade | Impacto | Mitigação                                                                                                                                                     | Status     |
| ------------------------------------------------------------- | ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Rate Limit ou indisponibilidade da API do Google Calendar     | Média         | Alto    | Rollback transacional decrementando participantes e excluindo registro local                                                                                  | Ativo      |
| Latência alta no salvamento de reservas                       | Média         | Médio   | Feedback imediato na tela de loading/skeletons para o candidato                                                                                               | Ativo      |
| Acoplamento excessivo com API proprietária do Supabase SDK    | Baixa         | Médio   | [Mitigado via Task 02] Definição de interfaces desacopladas (`ITimeSlotRepository`, `ISessionRepository`, `IParticipantRepository`)                           | Mitigado   |
| Falha na interpretação de fuso horário (America/Sao_Paulo)    | Média         | Médio   | Uso explícito de `Intl.DateTimeFormat` com fuso forçado e logs de data/hora no servidor.                                                                      | Monitorado |
| Complexidade/sintaxe dos filtros `.or()` do Supabase SDK      | Baixa         | Médio   | Validação estática nos testes de integração locais da camada de repositório.                                                                                  | Monitorado |
| Risco de Overbooking por concorrência simultânea              | Baixa         | Alto    | [Mitigado via Task 04] Implementação de Optimistic Lock no `tryReserveSeat` impedindo escrita de leituras defasadas.                                          | Mitigado   |
| Dívida técnica: Status hardcoded no rollback de participantes | Baixa         | Baixa   | [Dívida Futura] Caso novos estados de sessão sejam criados, `decrementParticipants` precisará recalcular status em vez de hardcodar `AVAILABLE`.              | Dívida     |
| Dependência do relacionamento participantes-sessões           | Baixa         | Médio   | [Mitigado via Relação Física] Integridade garantida pelas FKs físicas do banco. A checagem de duplicidade no repository mapeia a relação de forma estrita.    | Mitigado   |
| Manutenção e quebra de aliases no test runner (Vitest)        | Baixa         | Baixa   | Configuração centralizada de aliases no `vitest.config.ts` espelhando o `tsconfig.json`. Mapear manualmente novas importações se houver mudanças estruturais. | Monitorado |
| Ausência de dados locais para homologação da UI               | Alta          | Alto    | [Mitigado via Task 01] Implementada estratégia de Mock condicional de desenvolvimento em Server Actions.                                                      | Mitigado   |
| TimeSlot aberto sem Session ativa associada                   | Média         | Médio   | Mensagem de tratamento amigável na interface exibida pelo container/bottom sheet quando a action retorna erro.                                                | Ativo      |
| Travamento/loop de scroll do fundo atrás do Bottom Sheet      | Média         | Médio   | [Mitigado via Task 01] Uso de useEffect para manipular overflow do body dinamicamente no ciclo de exibição do slot selecionado.                               | Mitigado   |

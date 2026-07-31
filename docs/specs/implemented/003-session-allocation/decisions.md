# Decisions — 003 Session Allocation

[← Voltar para Feature](README.md)

---

## Histórico de Decisões Arquiteturais (RC-1)

| Data       | Contexto                    | Decisão                                                                                              | Motivo                                                                                                    | Impacto                                                                            |
| :--------- | :-------------------------- | :--------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| 2026-07-20 | Concorrência de Alocação    | Utilizar Optimistic Locking baseado no contador `current_participants` e `capacity` das sessões.     | Evita race conditions de sobreposição de assentos sem travas pessimistas pesadas no banco de dados.       | Garante integridade sob alta concorrência na Server Action pública de agendamento. |
| 2026-07-20 | Distribuição de Entrevistas | Implementar lógica de distribuição Round-Robin (rotativa) de hosts administradores ao criar sessões. | Distribui de forma justa e balanceada as sessões simultâneas entre os entrevistadores cadastrados.        | Abertura dinâmica de sessões já associadas ao organizador correto.                 |
| 2026-07-20 | Abertura de Sessões         | Utilizar criação sob demanda (lazy creation) de novas instâncias de sessões.                         | Evita a pre-população de sessões ociosas e a geração desnecessária de eventos remotos no Google Calendar. | Otimização do armazenamento local e cota de chamadas de API do Google.             |

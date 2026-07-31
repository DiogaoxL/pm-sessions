# Risks — 003 Session Allocation

[← Voltar para Feature](README.md)

---

## Tabela de Riscos Mapeados (RC-1)

| Risco                                              | Probabilidade | Impacto | Mitigação                                                                                                | Status    |
| :------------------------------------------------- | :------------ | :------ | :------------------------------------------------------------------------------------------------------- | :-------- |
| **Race Conditions de Capacidade**                  | Média         | Alto    | Uso de Optimistic Locking na atualização atômica de assentos em `sessions`.                              | `Mapeado` |
| **Estouro de API Rate Limit do Google**            | Baixa         | Médio   | Lazy creation (criação dinâmica apenas sob necessidade) e reutilização de chaves de integração.          | `Mapeado` |
| **Ausência de Hosts Disponíveis para Round-Robin** | Baixa         | Alto    | Fallback automático para um host padrão definido em variável de ambiente e validação inicial na criação. | `Mapeado` |
| **Double Booking/Inscrições Duplicadas**           | Média         | Médio   | Verificação de idempotência no banco de dados antes do agendamento (unicidade por e-mail e time slot).   | `Mapeado` |

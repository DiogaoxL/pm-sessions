# Risks — 004 Admin Panel

[← Voltar para Feature](README.md)

---

## Tabela de Riscos Mapeados (RC-1)

| Risco                                      | Probabilidade | Impacto | Mitigação                                                                                                                         | Status    |
| :----------------------------------------- | :------------ | :------ | :-------------------------------------------------------------------------------------------------------------------------------- | :-------- |
| **Acesso Indevido de Candidatos**          | Baixa         | Alto    | Implementação rigorosa do middleware de segurança validando o campo `role` da tabela de `admins`.                                 | `Mapeado` |
| **Dessincronização com o Google Calendar** | Média         | Médio   | Tratamento de erros detalhado na Server Action com reversão/rollback atômico dos dados locais se a API falhar.                    | `Mapeado` |
| **Race Condition na Edição de Capacidade** | Baixa         | Médio   | Validação do banco impedindo redução de capacidade para número menor do que a quantidade de participantes atualmente confirmados. | `Mapeado` |
| **Exclusão Acidental de Participantes**    | Baixa         | Alto    | Mensagem de confirmação visual (modal duplo) no frontend antes de disparar a ação de exclusão física/lógica.                      | `Mapeado` |

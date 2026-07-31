# Feature 004 — Admin Panel

Especificação de controle operacional e gerenciamento do painel administrativo do PM Sessions.

## Documentação de Acompanhamento

- [Dashboard Geral](dashboard.md)
- [Histórico de Progresso](progress.md)
- [Timeline de Desenvolvimento](timeline.md)
- [Registro de Decisões](decisions.md)
- [Mapeamento de Riscos](risks.md)
- [Notas Técnicas](notes.md)

---

## Release Candidates

### [RC-1: Painel Administrativo — Core e Operações](RC-1/README.md)

Fase inicial contendo a proteção de rotas, listagens de controle de capacidade e ações síncronas de gerenciamento de participantes sincronizadas com o Google Calendar.

---

## Critérios Gerais de Validação Técnica

- **Proteção de Rotas**: Nenhum usuário sem a role `admin` pode visualizar telas e consumir APIs sob o caminho `/admin`.
- **Consistência de Capacidade**: Toda alteração de participante (inserção, movimentação, exclusão) atualiza de forma atômica o contador de ocupação das sessões locais.
- **Integridade do Calendar**: Toda operação administrativa reflete de forma transparente nos eventos e links do Meet correspondentes no Google Calendar.

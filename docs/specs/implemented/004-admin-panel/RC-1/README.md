# RC-1: Painel Administrativo — Core e Operações

[← Voltar para Feature](../README.md)

---

## Objetivo

Disponibilizar a interface administrativa estruturada e as operações essenciais de controle de slots, sessões e participantes integrada de forma transacional e sincronizada com o Google Calendar.

## Tasks

- [ ] [Task 01: Proteção de Rotas e Middleware Administrativo](task-01.md)
- [ ] [Task 02: Gerenciamento Administrativo de Time Slots (CRUD)](task-02.md)
- [ ] [Task 03: Visualização do Dashboard e Listagens Administrativas](task-03.md)
- [ ] [Task 04: Regras de Negócio e Ações de Modificação de Participantes](task-04.md)
- [ ] [Task 05: Orquestração e Sincronização Automática com Google Calendar](task-05.md)

---

## Critérios de Conclusão

- [ ] Acesso seguro e restrito às páginas `/admin/*` para usuários autenticados com a role `admin`.
- [ ] Criação, edição e fechamento de Time Slots operacionais via dashboard.
- [ ] Visualização detalhada da capacidade das sessões e lista completa de participantes por sessão.
- [ ] Ações funcionais de remoção e movimentação de participantes atualizando dinamicamente a capacidade do banco.
- [ ] Sincronização automatizada e transparente com eventos e Meet do Google Calendar.

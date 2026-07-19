# Task 02: Criar Componente de Listagem de Horários Disponíveis

[← Voltar para RC](README.md) | [← Task Anterior](task-01.md) | [Próxima Task ➔](task-03.md)

---

# Objetivo

Desenvolver o componente de visualização agrupada de horários por data, permitindo fácil escaneabilidade e navegação pelo candidato.

---

# Contexto

Os horários disponíveis vêm em uma lista corrida do banco de dados. A UI precisa receber essa lista e agrupá-la de forma limpa por dia/data (por exemplo, exibindo abas ou seções para cada data e listando os cards de horários correspondentes dentro de cada seção).

---

# Dependências

- [Task 01](task-01.md)

---

# Arquivos que serão criados ou alterados

- **Criar**: `apps/web/src/features/scheduling/components/time-slot-list.tsx`

---

# Critérios de Aceite

1. O componente agrupa os slots disponíveis por dia correspondente.
2. Formatação localizada das datas exibidas (e.g. `Segunda-feira, 20 de Julho` ou `20/07`).
3. Permite a seleção visual de um slot de horário específico, disparando um callback para o container superior.
4. Exibe feedback claro e amigável quando a lista de horários fornecida estiver vazia (e.g., "Nenhum horário disponível para agendamento no momento").

---

# Riscos

- Lentidão no processamento e agrupamento de grandes listas de slots no cliente (mitigado limitando a listagem inicial ou utilizando memoização de cálculos via `useMemo`).

---

# Definition of Done

O componente de listagem agrupa e formata os horários corretamente, responde a eventos de clique e compila sem erros estáticos.

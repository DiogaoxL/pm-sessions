# RC-4 — Interface do Usuário e Componentes (Presentation Layer)

[← Voltar para Feature](../README.md)

**Status: IN_PROGRESS (57% Concluído)**

---

## Objetivo do Ciclo

Implementar a camada de interface (UI) para a funcionalidade de agendamento público, permitindo que candidatos visualizem horários disponíveis ordenados por data e realizem agendamentos com validações em tempo real no cliente e no servidor. A UI consumirá as Server Actions criadas no ciclo RC-3.

---

## Escopo da RC-4

Este ciclo aborda estritamente a camada de visualização (UI) e a lógica de apresentação associada no cliente Next.js.

### O que entra:

- Componentes de UI base para o fluxo de scheduling (cards, formulários, botões interativos de loading e feedback).
- Listagem pública de horários disponíveis organizada por datas.
- Formulário público de agendamento capturando nome, e-mail e telefone (opcional).
- Integração com as Server Actions `getAvailableSlotsAction` e `scheduleSessionAction`.
- Apresentação visual de feedback de validação (erros do Zod mapeados por campo) e tratamento de erros de negócio (concorrência de assentos e duplicidade).
- Componentização isolada sob a pasta `features/scheduling/components/`.
- Testes unitários de renderização e comportamento de UI usando Vitest e `@testing-library/react`.

### O que NÃO entra:

- Novas regras de negócio na camada de serviço.
- Alterações em esquemas de banco de dados ou tabelas.
- Modificações nas Server Actions implementadas no RC-3.
- Telas administrativas de gerenciamento de sessões ou horários (escopo de outras features).

---

## Estrutura do Ciclo (Tasks)

| Task                  | Título                                               | Status | Dependências | Estimativa | Complexidade |
| --------------------- | ---------------------------------------------------- | ------ | ------------ | ---------- | ------------ |
| [Task 01](task-01.md) | Criar Componentes Base de UI e Cards                 | `DONE` | RC-3         | 2h         | Baixa        |
| [Task 02](task-02.md) | Criar Componente de Listagem de Horários Disponíveis | `DONE` | Task 01      | 2h         | Média        |
| [Task 03](task-03.md) | Integrar Listagem com getAvailableSlotsAction        | `DONE` | Task 02      | 2h         | Baixa        |
| [Task 04](task-04.md) | Criar Formulário de Agendamento Público              | `DONE` | Task 01      | 2h         | Média        |
| [Task 05](task-05.md) | Integrar Formulário com scheduleSessionAction        | `TODO` | Task 04      | 3h         | Média        |
| [Task 06](task-06.md) | Tratamento de Estados, Loading e Mensagens de Erro   | `TODO` | Task 03, 05  | 3h         | Média        |
| [Task 07](task-07.md) | Testes Unitários de Componentes de UI                | `TODO` | Task 06      | 4h         | Alta         |

---

## Fluxo da UI e Jornada do Candidato

```
[Listagem de Slots (Disponíveis)]
               │
               ▼ (Candidato seleciona um Slot)
[Formulário de Agendamento (Modal/Seção)]
               │
               ├───► Valida no cliente (Zod + Estado)
               │        └── Se inválido: Exibe erros nos campos correspondentes
               │
               ▼ (Candidato clica em Agendar)
[Dispara Server Action (Loading State)]
               │
               ├───► Se falhar: Traduz e exibe erro (sem vagas, duplicado)
               │
               ▼ (Sucesso)
[Exibe Tela/Feedback de Confirmação de Agendamento]
```

---

## Critérios de Aceite Gerais do Ciclo

1. A interface de agendamento público carrega e lista os horários disponíveis dinamicamente a partir do banco de dados.
2. O formulário exibe mensagens de erro de validação (Zod) diretamente abaixo do input correspondente em tempo real ou na submissão.
3. Tratamento visual refinado para estados de carregamento (loading skeleton/spinners) durante a busca e o envio de dados.
4. Cobertura de testes unitários para os comportamentos cruciais da interface (renderização, interações de clique, feedbacks e mensagens de erro).
5. O aplicativo compila e passa em todos os passos de verificação estática (`typecheck` e `lint`).

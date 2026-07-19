# RC-3 — Server Actions e Validações (Presentation Boundary)

[← Voltar para Feature](../README.md)

**Status: IN_PROGRESS (83% Concluído)**

---

## Objetivo do Ciclo

Implementar a camada de Server Actions da Feature **001 - Public Scheduling**, atuando como a fronteira de apresentação do servidor. Ela será responsável por validar dados de entrada usando schemas do Zod, instanciar a camada de serviços através de uma factory e expor endpoints seguros e tipados para a interface do usuário.

## Estrutura do Ciclo (Tasks)

| Task                  | Título                                             | Status | Dependências | Estimativa | Complexidade |
| --------------------- | -------------------------------------------------- | ------ | ------------ | ---------- | ------------ |
| [Task 01](task-01.md) | Criar DTOs de Validação com Zod                    | `DONE` | RC-2         | 2h         | Baixa        |
| [Task 02](task-02.md) | Criar Instanciação do Service via Factory          | `DONE` | Task 01      | 2h         | Baixa        |
| [Task 03](task-03.md) | Implementar Action de Listagem de Slots            | `DONE` | Task 02      | 2h         | Baixa        |
| [Task 04](task-04.md) | Implementar Action de Agendamento com Tratamento   | `DONE` | Task 03      | 4h         | Média        |
| [Task 05](task-05.md) | Sincronizar e Exportar Actions no Ponto de Entrada | `DONE` | Task 04      | 1h         | Baixa        |
| [Task 06](task-06.md) | Testes Unitários das Server Actions                | `TODO` | Task 05      | 4h         | Média        |

---

## Governança e Regras

1. **Validação Rigorosa**: Toda entrada de dados vinda do cliente deve passar obrigatoriamente pela validação do schema do Zod correspondente antes de ser encaminhada ao serviço.
2. **Payloads Tipados**: As Server Actions devem retornar um padrão de payload unificado para tratamento de estado e exibição de erros no cliente:
   - Sucesso: `{ success: true, data: T }`
   - Erro: `{ success: false, error: string, validationErrors?: z.inferFlattenedErrors<typeof schema> }`
3. **Isolamento de Erros**: Erros de negócio esperados do serviço devem ser capturados e traduzidos para mensagens amigáveis de erro, enquanto erros inesperados devem ser logados e ocultados sob uma mensagem de erro genérica.
4. **Desacoplamento de UI**: As ações não devem lidar diretamente com elementos visuais, apenas retornar dados brutos e status de sucesso/falha.

---

## Fluxo Arquitetural da RC-3

```
[UI/Componente (Client)]
       │
       ▼ (invoca)
[Server Action (scheduleSessionAction)]
       │
       ├───► Valida entrada com Zod Schema
       │        └── Se falhar: Retorna validationErrors
       │
       ├───► Instancia SchedulingService via Factory
       │
       ├───► Invoca scheduleSession() do Service
       │        ├── Se erro de negócio: Retorna erro traduzido
       │        └── Se erro de banco/inesperado: Oculta e retorna erro genérico
       │
       ▼ (sucesso)
Retorna { success: true, data: Participant }
```

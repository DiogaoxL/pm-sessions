# Task 04: Implementar Action de Agendamento com Tratamento

[← Voltar para RC](README.md) | [← Task Anterior](task-03.md) | [Próxima Task ➔](task-05.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Implementar a Server Action `scheduleSessionAction()` para orquestrar de forma ponta a ponta o agendamento de uma sessão pública, incluindo validação de Zod e mapeamento semântico de erros.

---

# Contexto

Esta Server Action recebe os dados preenchidos no formulário pelo candidato. Ela executa a validação estrutural (Zod) e, caso seja válida, invoca o caso de uso no `SchedulingService`. Se o serviço reportar erros de negócio (e.g. duplicidade, vaga indisponível), a ação traduz os erros em payloads compreensíveis para a UI.

---

# Dependências

- [Task 03](task-03.md)

---

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/actions/schedule-session.ts`

---

# Arquivos que NÃO podem ser alterados

Nenhum.

---

# Ordem de Implementação

1. Criar o arquivo `schedule-session.ts` no diretório `actions/`.
2. Adicionar a diretiva `'use server'` no topo do arquivo.
3. Definir a função assíncrona `scheduleSessionAction(inputData: unknown)`.
4. Validar `inputData` contra o schema `scheduleSessionSchema` da Task 01.
5. Se a validação falhar, retornar imediatamente:
   - `{ success: false, error: "Dados inválidos", validationErrors: result.error.flatten() }`
6. Se passar, chamar `getSchedulingService()` para obter o serviço.
7. Dentro de um bloco `try/catch`, invocar `service.scheduleSession(email, name, sessionId, timeSlotId)`.
8. Tratar exceções conhecidas de negócio e mapeá-las:
   - Se a mensagem contiver `"No seats available"`, mapear para `{ success: false, error: "Esta sessão já não possui vagas disponíveis." }`.
   - Se a mensagem contiver `"Duplicated participant"`, mapear para `{ success: false, error: "Você já está cadastrado para este horário." }`.
   - Caso seja outro erro genérico ou de banco, capturar e retornar `{ success: false, error: "Ocorreu um erro ao processar o seu agendamento. Tente novamente mais tarde." }`.
9. Em caso de sucesso, retornar `{ success: true, data: Participant }`.

---

# Checklist Técnico

- [ ] Criar arquivo `schedule-session.ts` com diretiva `'use server'`.
- [ ] Aplicar validação estrutural do Zod nos parâmetros de entrada.
- [ ] Tratar erros de validação retornando `validationErrors` mapeados.
- [ ] Instanciar o service via factory.
- [ ] Chamar `service.scheduleSession()` no fluxo seguro.
- [ ] Mapear mensagens de erro de negócio para respostas amigáveis.
- [ ] Ocultar detalhes de erros técnicos/inesperados retornando uma mensagem genérica de falha.
- [ ] Retornar payload de sucesso com dados do participante.

---

# Critérios de Aceite

- Retorna `{ success: true, data: Participant }` em agendamentos bem-sucedidos.
- Retorna `{ success: false, error: string }` com a mensagem traduzida correta nos casos de erro mapeados.
- Retorna `{ success: false, error: "Dados inválidos", validationErrors: ... }` em falhas de validação de schema.
- O typecheck da aplicação finaliza com sucesso.

---

# Como Testar

Verificar compilação do TypeScript no monorepo:

```bash
pnpm --filter web typecheck
```

---

# Rollback

Excluir o arquivo `schedule-session.ts`.

---

# Riscos

- Omissão de validações críticas ou vazamento de erros de banco crus para a interface (mitigado por meio de um tratamento abrangente no try/catch e validação rígida de Zod).

---

# Definition of Done

A Server Action de agendamento de sessões públicas está concluída, com validação de dados de entrada e mapeamento de erros, compilando sem falhas de tipo.

---

# Commits sugeridos

- `feat(scheduling): implement scheduleSession Server Action with Zod validation and error mapping`

---

# Observações

Nenhuma.

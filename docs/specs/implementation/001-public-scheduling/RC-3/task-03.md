# Task 03: Implementar Action de Listagem de Slots

[← Voltar para RC](README.md) | [← Task Anterior](task-02.md) | [Próxima Task ➔](task-04.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Implementar a Server Action `getAvailableSlotsAction()` para buscar e listar os horários disponíveis de agendamento público de forma segura.

---

# Contexto

A Server Action fornece um endpoint no servidor para a UI ler os horários em tempo real. Esta ação delega o processamento ao `SchedulingService` e trata possíveis erros retornando um payload com status unificado.

---

# Dependências

- [Task 02](task-02.md)

---

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/actions/get-available-slots.ts`

---

# Arquivos que NÃO podem ser alterados

Nenhum.

---

# Ordem de Implementação

1. Criar o arquivo `get-available-slots.ts` no diretório `actions/`.
2. Adicionar a diretiva `'use server'` no topo do arquivo.
3. Definir a função assíncrona `getAvailableSlotsAction()`.
4. Obter a instância do serviço usando `await getSchedulingService()`.
5. Executar `await service.getAvailableSlots()`.
6. Tratar erros envolvendo a consulta em um bloco `try/catch`.
7. Retornar:
   - Sucesso: `{ success: true, data: TimeSlot[] }`
   - Erro: `{ success: false, error: "Mensagem amigável de erro" }`

---

# Checklist Técnico

- [ ] Criar arquivo `get-available-slots.ts` com diretiva `'use server'`.
- [ ] Obter a instância do serviço via factory.
- [ ] Chamar busca de horários disponíveis.
- [ ] Implementar bloco try/catch para segurança.
- [ ] Retornar payload padronizado e tipado.

---

# Critérios de Aceite

- Retorna `{ success: true, data: TimeSlot[] }` caso a busca ocorra sem problemas.
- Retorna `{ success: false, error: string }` em caso de falha de consulta.
- A compilação do TypeScript é finalizada com sucesso.

---

# Como Testar

Verificar compilação do TypeScript no monorepo:

```bash
pnpm --filter web typecheck
```

---

# Rollback

Excluir o arquivo `get-available-slots.ts`.

---

# Riscos

- Expor mensagens técnicas brutas de banco de dados (mitigado mapeando erros de banco para uma mensagem genérica de falha ao carregar horários).

---

# Definition of Done

A Server Action de listagem de horários está concluída, tratada contra falhas e compilando.

---

# Commits sugeridos

- `feat(scheduling): implement getAvailableSlots Server Action`

---

# Observações

Nenhuma.

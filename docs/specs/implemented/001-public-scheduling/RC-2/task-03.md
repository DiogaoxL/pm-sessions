# Task 03: Implementar Fluxo de Reserva de Vagas

[← Voltar para RC](README.md) | [← Task Anterior](task-02.md) | [Próxima Task ➔](task-04.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Implementar o método `reserveSeat(sessionId: string): Promise<boolean>` no `SchedulingService`.

---

# Contexto

A reserva atômica de vagas no banco de dados é crítica para evitar concorrência e overbooking. O service delega a tentativa de reserva ao repositório de sessões, garantindo que o fluxo seja atômico.

---

# Dependências

- [Task 02](task-02.md)

---

# Arquivos que serão alterados

- **Alterar**: `apps/web/src/features/scheduling/services/interfaces.ts`
- **Alterar**: `apps/web/src/features/scheduling/services/scheduling.service.ts`

---

# Arquivos que NÃO podem ser alterados

Nenhum.

---

# Ordem de Implementação

1. Adicionar o método `reserveSeat(sessionId: string): Promise<boolean>` na interface `ISchedulingService`.
2. Implementar o método no `SchedulingService` chamando `sessionRepository.tryReserveSeat(sessionId)`.
3. Propagar o retorno booleano indicando o sucesso ou fracasso da reserva.

---

# Checklist Técnico

- [ ] Declarar `reserveSeat` no contrato do service.
- [ ] Implementar chamada do optimistic lock do repositório no `SchedulingService`.
- [ ] Validar retorno de reserva de assento.

---

# Critérios de Aceite

- Retorna `true` caso a vaga tenha sido incrementada com sucesso.
- Retorna `false` em caso de falta de vaga ou conflito concorrente.

---

# Como Testar

Verificar a compilação estática dos tipos:

```bash
pnpm --filter web typecheck
```

---

# Rollback

Remover a declaração e a implementação do método `reserveSeat` dos arquivos de serviço.

---

# Riscos

- Omissão de falhas internas (resolvido propagando erros reais exceto nos casos controlados de concorrência onde retorna false).

---

# Definition of Done

O método de reserva atômica está concluído e tipado.

---

# Commits sugeridos

- `feat(scheduling): implement reserveSeat in service`

---

# Observações

Nenhuma.

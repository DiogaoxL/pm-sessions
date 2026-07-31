# Task 03: Implement TimeSlotRepository

[← Voltar para RC](README.md) | [← Task Anterior](task-02.md) | [Próxima Task ➔](task-04.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Implementar a classe `TimeSlotRepository` para buscar os slots de data/horário ativos e disponíveis para a página pública.

# Contexto

O candidato ao acessar a página precisa ver apenas horários futuros configurados como abertos (`'OPEN'`). O repositório encapsula esta query de leitura do Supabase.

# Dependências

- [Task 02](task-02.md)

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/repositories/time-slot.repository.ts`

# Arquivos que NÃO podem ser alterados

Nenhum.

# Ordem de Implementação

1. Criar classe `TimeSlotRepository` implementando `ITimeSlotRepository`.
2. Chamar o cliente seguro do Supabase.
3. Filtrar os resultados de forma que apenas slots futuros ou do dia atual (com horário de início posterior ao momento atual) sejam exibidos, respeitando a regra para cumprimento da **DR-008**:
   - `date > CURRENT_DATE` OU (`date = CURRENT_DATE` AND `start_time > CURRENT_TIME`)
   - A comparação e cálculo do momento atual devem respeitar o fuso horário oficial do projeto (`America/Sao_Paulo`).
4. Ordenar os resultados por data e horário de início crescentes.

# Checklist Técnico

- [ ] Criar arquivo `time-slot.repository.ts`.
- [ ] Implementar interface `ITimeSlotRepository`.
- [ ] Estruturar a query de slots futuros disponíveis.

# Critérios de Aceite

- Query estruturada, segura e tipada.
- Retorno compatível com o formato `{ id, date, start_time, end_time }`.
- Filtro de slots passados respeitando estritamente a regra de data e hora atual sob o fuso horário `America/Sao_Paulo` (DR-008).

# Como Testar

Typecheck e lint:

```bash
pnpm --filter web typecheck
pnpm --filter web lint
```

# Rollback

Excluir o arquivo `time-slot.repository.ts`.

# Riscos

Desempenho da query em picos de agendamento (mitigado por índice na coluna de data e status).

# Definition of Done

A classe `TimeSlotRepository` compila sem erros, implementa corretamente a interface e exporta o método de busca de slots ativos de forma íntegra.

# Commits sugeridos

- `feat(scheduling): implement TimeSlotRepository`

# Observações

Nenhuma.

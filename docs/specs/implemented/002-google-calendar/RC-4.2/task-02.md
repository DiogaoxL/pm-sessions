# Task-02: Consulta de Disponibilidade (FreeBusy / Horários Livres)

[← Voltar para RC](README.md) | [← Task Anterior](task-01.md) | [Próxima Task →](task-03.md)

---

# Objetivo

Consumir a disponibilidade do Google Calendar utilizando a API FreeBusy, convertendo os períodos ocupados para o formato utilizado internamente pelo PM Sessions.

# Contexto

Antes de permitir que o usuário agende, precisamos garantir que o horário consultado na agenda do administrador está realmente livre. A API do Google nos retorna uma lista de blocos ocupados, os quais devemos subtrair das nossas vagas potenciais.

# Dependências

- **Task 01** concluída.

# Arquivos que serão criados

Nenhum.

# Arquivos que serão alterados

- **Modificar**: `apps/web/src/features/scheduling/services/google-calendar.service.ts`

# Arquivos proibidos de alteração

- Qualquer arquivo do banco de dados (migrações).

# Ordem de Implementação

1. **API FreeBusy**:
   - Desenvolver o método `checkAvailability` em `GoogleCalendarService` consultando os limites de data via requisição `freebusy.query` do SDK.
2. **Conversão de Formato**:
   - Implementar função utilitária para subtrair blocos ocupados dos slots potencias e retornar a lista formatada de Time Slots disponíveis.
   - Tratar timezones (garantindo `America/Sao_Paulo` de forma consistente).
3. **Testes Unitários**:
   - Criar testes no service simulando múltiplos cenários de agendas ocupadas retornadas pela API e verificando se os slots resultantes estão corretos.

# Checklist Técnico

- [ ] Implementar método para consulta à API FreeBusy do Google.
- [ ] Implementar algoritmo local de filtragem/subtração de slots baseando-se em horários ocupados.
- [ ] Aplicar fuso horário de São Paulo nas datas/horários retornados.

# Critérios de Aceite

- [ ] A API FreeBusy é consultada com sucesso com um range de data de testes.
- [ ] O algoritmo gera a lista filtrada de slots corretamente nos testes unitários mockados.

# Como Testar

1. Executar testes de disponibilidade: `npx vitest run google-calendar.service.test.ts`.

# Rollback

- Reverter alterações do Git em `google-calendar.service.ts`.

# Riscos

- **Erros de Timezone**: Mitigado garantindo parse estrito das strings de ISO String contendo deslocamento UTC correto.

# Definition of Done

- [ ] Compila sem erros de tipagem.
- [ ] Lint estático aprovado.
- [ ] Testes unitários com mock passando.

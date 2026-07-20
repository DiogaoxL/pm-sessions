# Task-02: Resolver Acessibilidade (a11y) e UX no Form e Banners

[← Voltar para RC](../README.md) | [← Task Anterior](task-01.md) | [Próxima Task →](task-03.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Corrigir as lacunas de acessibilidade (`aria-invalid`, `aria-describedby`, `role="alert"`, `autoComplete`) e refinar a exibição de erros no formulário de agendamento público.

# Contexto

A auditoria de acessibilidade identificou que os leitores de tela não associam erros aos inputs e não anunciam os banners dinâmicos de erro. Além disso, a auditoria de UX apontou ruído visual devido à exibição paralela de um banner global de validação juntamente com as mensagens de erro individuais nos inputs.

# Dependências

- **Task 01** iniciada ou concluída.

# Arquivos que serão alterados

- **Modificar**: `apps/web/src/features/scheduling/components/scheduling-form.tsx`
- **Modificar**: `apps/web/src/features/scheduling/components/available-slots-container.tsx`

# Arquivos que NÃO podem ser alterados

- **Não alterar**: Lógica de regras de negócio.

# Ordem de Implementação

1. **Acessibilidade nos Inputs**:
   - No `SchedulingForm`, vincule cada input (`name`, `email`, `phone`) ao seu respectivo parágrafo de erro usando `aria-describedby` e o `id` da mensagem de erro.
   - Aplique `aria-invalid={!!fieldErrors.X}` condicionalmente a cada input.
   - Adicione o atributo `autoComplete` apropriado em cada input (`name`, `email`, `tel`).
2. **Acessibilidade nos Banners**:
   - Adicione `role="alert"` e `aria-live="assertive"` nos wrappers dos banners de erro do `SchedulingForm` e do `AvailableSlotsContainer`.
3. **Refinamento de UX**:
   - Ajuste o tratamento de erros do `SchedulingForm` para **não** preencher o `globalError` (banner global) quando houver `validationErrors.fieldErrors` do Zod. Exiba o banner global apenas para erros de negócio (vagas esgotadas, duplicidade) ou exceções técnicas do `catch`.

# Checklist Técnico

- [ ] Vincular inputs com parágrafos de erro via `aria-describedby` e `id` únicos.
- [ ] Aplicar `aria-invalid` dinamicamente nos inputs do form.
- [ ] Adicionar `autoComplete` nos campos do form.
- [ ] Inserir `role="alert"` em todos os banners de erro dinâmicos.
- [ ] Ocultar o banner global no formulário durante falhas estruturais (erros inline do Zod).

# Critérios de Aceite

- [ ] Leitores de tela anunciam dinamicamente a presença de erros ao focar nos inputs inválidos.
- [ ] O anúncio de erro global é imediato por leitores de tela quando exibido (devido ao `role="alert"`).
- [ ] Submeter um formulário com dados inválidos exibe apenas as mensagens em vermelho abaixo de cada input correspondente, sem exibir o banner genérico vermelho "Dados inválidos" no topo.
- [ ] Erros de negócio (como e-mail duplicado) continuam exibindo o banner global vermelho de erro.

# Como Testar

1. Executar os testes unitários do formulário: `npx vitest run scheduling-form.test.tsx`.
2. Validar manualmente preenchendo o formulário com dados incorretos e observando a ausência do banner global vermelho.
3. Inspecionar o código HTML no navegador para confirmar a presença de `aria-invalid`, `aria-describedby` e `role="alert"`.

# Rollback

- Reverter alterações do Git nos arquivos de componentes.

# Definition of Done

- [ ] Compila sem erros de tipagem.
- [ ] Lint estático aprovado.
- [ ] Testes unitários atualizados e verdes.

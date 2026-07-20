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
   - Ajuste o tratamento de erros do `SchedulingForm` para **não** preencher o `globalError` (banner global) quando houver `validationErrors.fieldErrors` do Zod. Exiba o banner global apenas para erros de negócio (vagas esgotadas, duplicidade) ou# Checklist Técnico

- [x] Vincular inputs com parágrafos de erro via `aria-describedby` e `id` únicos.
- [x] Aplicar `aria-invalid` dinamicamente nos inputs do form.
- [x] Adicionar `autoComplete` nos campos do form.
- [x] Inserir `role="alert"` em todos os banners de erro dinâmicos.
- [x] Ocultar o banner global no formulário durante falhas estruturais (erros inline do Zod).

# Critérios de Aceite

- [x] Leitores de tela anunciam dinamicamente a presença de erros ao focar nos inputs inválidos.
- [x] O anúncio de erro global é imediato por leitores de tela quando exibido (devido ao `role="alert"`).
- [x] Submeter um formulário com dados inválidos exibe apenas as mensagens em vermelho abaixo de cada input correspondente, sem exibir o banner genérico vermelho "Dados inválidos" no topo.
- [x] Erros de negócio (como e-mail duplicado) continuam exibindo o banner global vermelho de erro.

# Como Testar

1. Executar os testes unitários do formulário: `npx vitest run scheduling-form.test.tsx`.
2. Validar manualmente preenchendo o formulário com dados incorretos e observando a ausência do banner global vermelho.
3. Inspecionar o código HTML no navegador para confirmar a presença de `aria-invalid`, `aria-describedby` e `role="alert"`.

# Seção Visual e Homologação (Obrigatório para Tasks com UI)

### Fluxo de Homologação Visual

Os seguintes estados e fluxos devem ser homologados manualmente na interface para validar as correções de a11y e UX:

- **Estado Inicial**: Sem erros exibidos. Os inputs não possuem os atributos `aria-invalid` nem tags de id dinâmicas associadas ao `aria-describedby` que possam confundir o leitor de telas.
- **Erros de Validação (UX/Zod)**: Inserir dados inválidos nos campos. A validação deve exibir apenas mensagens inline vermelhas sob os respectivos inputs. O banner global vermelho não deve aparecer.
- **Erros Globais/Negócio**: Inserir e-mails de mock de erro (`duplicate@example.com` ou `error@example.com`). Deve aparecer o banner global vermelho com `role="alert"` e `aria-live="assertive"`.
- **Cancelamento**: Fechar o formulário (ou bottom sheet no mobile). Os estados de erro devem ser resetados no unmount/fechamento.

### Estratégia de Mock para Desenvolvimento

As Server Actions simuladas criadas na Task 01 devem ser reutilizadas para homologação visual local:

- **Origem dos Mocks**: Mocks embutidos em `getAvailableSlotsAction`, `getSessionBySlotAction` e `scheduleSessionAction` rodando sob `NODE_ENV === 'development'`.
- **Validação de Erro de Validação (Inline)**: Submeter campos vazios ou formatos inválidos de telefone/e-mail no formulário.
- **Validação de Erro Global (Negócio)**: Submissão do e-mail `duplicate@example.com` para simular colisão e `error@example.com` para simular concorrência.
- **Remoção**: A remoção dos mocks será executada em fases posteriores, mantendo as Server Actions intactas durante o ciclo de validação visual.

### Jornada Completa do Usuário

A jornada percorrida pelo usuário para validação visual dos estados de erro e a11y consiste em:

1. Abrir formulário (/scheduling).
2. Tentar submeter dados vazios ou e-mails em formato inválido.
3. Receber feedback de erros inline específicos por input.
4. Corrigir os erros inline preenchendo dados adequadamente.
5. Tentar submeter o e-mail de mock duplicado.
6. Receber feedback do banner de erro global.
7. Corrigir o e-mail para um e-mail válido.
8. Submeter e receber a confirmação visual de sucesso.

### Validação Recomendada (Acessibilidade)

Recomenda-se executar a inspeção visual e semântica utilizando:

- **Accessibility Tree (DevTools)**: Verificar se os inputs expõem corretamente o nome e a descrição associada (`aria-describedby`) aos parágrafos de erro.
- **DevTools Accessibility**: Confirmar a presença correta de `role="alert"` e `aria-live="assertive"` nos banners dinâmicos de erro.
- **Navegação por Teclado**: Certificar-se de que é possível focar nos campos do formulário e submetê-lo usando apenas o teclado.

# Rollback

- Reverter alterações do Git nos arquivos de componentes.

# Definition of Done

- [x] Compila sem erros de tipagem.
- [x] Lint estático aprovado.
- [x] Testes unitários atualizados e verdes.

# Resultado de Implementação

Status:
✅ Implementada

Resumo:

- Correção de acessibilidade dos campos utilizando `aria-invalid` e `aria-describedby`.
- Inclusão de `autocomplete` apropriado.
- Inclusão de `role="alert"` e `aria-live="assertive"` para banners globais.
- Remoção do banner vermelho redundante para erros estruturais do Zod.
- Mantido banner global apenas para erros de negócio (duplicidade, sessão lotada, erros inesperados).

# Resultado da Homologação Visual

Status:
✅ Homologada

Valilações realizadas:

- Página carregando corretamente
- Skeleton funcionando
- Seleção de horário funcionando
- Formulário carregando corretamente
- Validação inline dos campos
- Banner global apenas para erros de negócio
- Fluxo de sucesso validado
- Desktop validado
- Mobile validado

Observação registrada:
Refinamento visual futuro recomendado para reduzir a altura do banner de erro global, melhorando o equilíbrio visual do card. Não é bloqueante.

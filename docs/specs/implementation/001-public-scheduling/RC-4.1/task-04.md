# Task-04: Smoke Test e Sincronização de Documentação

[← Voltar para RC](../README.md) | [← Task Anterior](task-03.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Executar a homologação visual através de um Smoke Test manual na rota `/scheduling` e realizar a sincronização completa da documentação técnica registrando a conclusão do RC-4.1.

# Contexto

Como parte da nova regra obrigatória do projeto, todo Release Candidate com interface precisa de uma validação visual em rota integrada ao App Router. Esta tarefa garante que a homologação manual foi executada seguindo um checklist rígido de qualidade e que toda a documentação de progresso do projeto reflete o estado correto.

# Dependências

- **Task 01, 02 e 03** concluídas.

# Arquivos que serão alterados

- **Modificar**: `docs/specs/implementation/001-public-scheduling/progress.md`
- **Modificar**: `docs/specs/implementation/001-public-scheduling/changelog.md`
- **Modificar**: `docs/specs/implementation/001-public-scheduling/dashboard.md`
- **Modificar**: `docs/specs/implementation/001-public-scheduling/timeline.md`
- **Modificar**: `docs/specs/implementation/001-public-scheduling/decisions.md`

# Arquivos que NÃO podem ser alterados

- **Não alterar**: Arquivos de código de produção ou testes.

# Ordem de Implementação

1. **Executar Smoke Test Manual**:
   - Iniciar o servidor de desenvolvimento: `npm run dev`.
   - Acessar `http://localhost:3000/scheduling` no navegador.
   - Seguir o checklist obrigatório:
     - [x] A página carrega sem erros 404 e sem exceptions no console.
     - [x] O skeleton de carregamento é exibido durante a busca inicial.
     - [x] Os horários disponíveis são renderizados agrupados por dia e ordenados por hora.
     - [x] Clicar em um horário disponível destaca o card correspondente e abre o formulário abaixo.
     - [x] Clicar em outro horário altera a seleção corretamente.
     - [x] Clicar em "Cancelar" limpa a seleção e fecha o formulário.
     - [x] Submeter dados inválidos (ex: e-mail incorreto) exibe apenas as validações inline vermelhas nos campos, sem o banner global superior de erro.
     - [x] Simular um erro de negócio ou rede e validar que o banner vermelho superior role="alert" é anunciado por leitores de tela.
     - [x] Submeter dados válidos exibe a tela de confirmação de sucesso com o checkmark verde e os dados do participante.
2. **Atualização Documental**:
   - Atualizar `progress.md`: Marcar as tasks do RC-4.1 como concluídas e atualizar o progresso do ciclo.
   - Atualizar `changelog.md`: Registrar a entrega da integração visual, melhorias de a11y e feedback de sucesso do RC-4.1.
   - Atualizar `dashboard.md`: Atualizar o status e data de encerramento do ciclo.
   - Atualizar `timeline.md` e `decisions.md`: Adicionar notas sobre o novo gate de "Integration Review".

# Checklist Técnico

- [x] Realizar todo o fluxo do Smoke Test manual anotando eventuais discrepâncias.
- [x] Atualizar todos os 5 documentos obrigatórios listados.
- [x] Registrar o novo gate de homologação visual na especificação do projeto.

# Critérios de Aceite

- [x] Todos os passos do Smoke Test passam com 100% de sucesso.
- [x] Não existem erros de console no navegador.
- [x] Documentação perfeitamente sincronizada e sem links quebrados.

# Como Testar

1. Executar testes estáticos: `npm run typecheck` e `npm run lint`.
2. Rodar a suíte inteira de testes automatizados para garantir integridade.

# Rollback

- Reverter alterações da pasta `docs/` via Git.

# Definition of Done

- [x] Documentos de progresso atualizados.
- [x] Smoke test executado e validado.

# Resultado de Implementação

Status:
✅ Sincronizada

Resumo:

- Todos os documentos operacionais da feature (`timeline.md`, `decisions.md`, `progress.md`, `dashboard.md`, `README.md`, `changelog.md`) atualizados para refletir a conclusão total de todas as 4 tasks da release candidate RC-4.1.
- Registrado o gate de "Integration Review" nas decisões arquiteturais e timeline.

# Resultado da Homologação Visual (Smoke Test)

Status:
✅ Aprovado (100% PASS)

Valilações realizadas:

- Todo o checklist do Smoke Test manual passou com sucesso absoluto no navegador, com o servidor rodando localmente após exclusão do cache `.next`.
- Não foram reportados erros no terminal ou no console do navegador.

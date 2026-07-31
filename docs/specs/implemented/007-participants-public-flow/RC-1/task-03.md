# Task 03: Tratamento de Concorrência (SESSION_FULL) & Atualização Reativa

# Objetivo

Garantir o tratamento correto contra falhas de concorrência simultânea e a revalidação ágil das vagas na lista.

# Escopo

- **Filtragem de Erro**: Interceptar e tratar especificamente o erro de código `P0001` (`SESSION_FULL`) retornado pelo banco. Outros tipos de erros devem cair no fluxo de erro genérico da aplicação.
- **Feedback de Sessão Lotada**: Renderizar uma tela/banner explicativa quando o erro for `P0001`.
- **Revalidação Automática da Lista**:
  - Após sucesso no agendamento, recarregar a lista de horários (`router.refresh()`).
  - Após o erro `SESSION_FULL`, recarregar a lista de horários imediatamente para remover a opção que acabou de lotar da tela.

# Dependências

Task 02.

# Critérios de Aceite

- [ ] Apenas o erro `P0001` (`SESSION_FULL`) dispara o aviso de vaga indisponível.
- [ ] A lista de horários é atualizada de forma automática após sucesso ou após retornar sessão cheia.

## UI Compliance

- [ ] Brand Guide seguido
- [ ] Design System seguido
- [ ] Component Library reutilizada
- [ ] Tokens utilizados
- [ ] UX Principles respeitados
- [ ] Accessibility validada
- [ ] Estados de Loading
- [ ] Estados de Erro
- [ ] Empty State
- [ ] Responsividade

# Critérios de Homologação

1. Simular um erro `P0001` (sessão lotada) ao submeter e validar se o banner explicativo de "vaga indisponível" é exibido na tela.
2. Validar se outros erros (ex: erro de rede) exibem o toast/alerta genérico padrão do sistema.
3. Concluir um agendamento com sucesso e verificar se a lista de horários é revalidada via revalidação de rotas Next.js.
4. Tentar agendar um slot que acabou de ser lotado concorrentemente. Validar se a lista de horários é atualizada após o erro `SESSION_FULL`.

# Evidências Esperadas

- Tratamento específico de erro SQL `P0001` no formulário público.
- Trigger de revalidação `router.refresh()` disparado ao fechar/finalizar o fluxo ou receber erros de concorrência.

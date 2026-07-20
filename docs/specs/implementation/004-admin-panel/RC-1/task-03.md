# Task 03: Visualização do Dashboard e Listagens Administrativas

[← Voltar para RC](README.md) | [← Task Anterior](task-02.md) | [Próxima Task →](task-04.md)

---

# Objetivo

Desenvolver as interfaces visuais do painel, fornecendo indicadores agregados no Dashboard e listagens estruturadas com capacidade em tempo real das sessões e visualização de participantes.

# Escopo

- **Dashboard Visual**:
  - Cards com métricas consolidadas (Total de Inscritos, Slots Disponíveis, Total de Sessões Ativas).
  - Lista de Time Slots ordenada cronologicamente.
- **Componentes de Visualização**:
  - Ao clicar em um Time Slot, exibir todas as sessões simultâneas criadas nele.
  - Mostrar a lotação (ex.: `current_participants` / `capacity`) em badge colorido para identificação visual fácil.
  - Lista expansível com o nome e e-mail dos participantes confirmados por sessão.

# Dependências

- **Task-02** concluída.

## Observabilidade

Durante a implementação deverá existir alguma forma de validar visualmente o comportamento.

Pode ser:

- Console
- Network
- URL
- Banco
- Logs

Não é permitido implementar comportamento invisível.

# Critérios de Aceite

- [ ] Tela do Dashboard inicial exibe os indicadores corretos sincronizados com o banco de dados.
- [ ] Componente lista os slots agrupados por data e horários.
- [ ] Detalhes do slot exibem a lista de sessões com indicação de lotação.
- [ ] Interface é responsiva, segue a identidade visual e exibe estado de loading durante consultas assíncronas.
- [ ] Mostrar estado Empty quando não existirem slots.

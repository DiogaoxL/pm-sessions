# Task-02: Algoritmo de Alocação e Abertura Sequencial de Sessões

[← Voltar para RC](README.md) | [← Task Anterior](task-01.md) | [Próxima Task →](task-03.md)

---

# Objetivo

Implementar a regra central de alocação de participantes no `SchedulingService`, realizando a distribuição sequencial e determinística e criando automaticamente novas sessões ao atingir capacidade total.

# Escopo

- **Service (SchedulingService)**:
  - Alterar a lógica do método `scheduleSession` (ou adicionar um serviço dedicado de alocação) para obter todas as sessões ativas do respectivo `time_slot_id`.
  - Percorrer a lista ordenada de sessões e tentar reservar uma vaga na primeira sessão disponível (que ainda tenha capacidade livre).
  - Se todas as sessões existentes do slot estiverem cheias, criar automaticamente uma nova sessão e, em seguida, registrar o participante nela.
- **SessionCreator (Lógica de Criação Automática)**:
  - A nova sessão criada herdará o `time_slot_id` e a capacidade padrão.
  - A escolha e atribuição do host (organizador) é delegada a um serviço dedicado (ex.: `HostAllocator` ou equivalente), desacoplando a escolha do host da lógica principal de alocação de participantes.

# Dependências

- **Task-01** concluída.

# Critérios de Aceite

- [ ] O algoritmo percorre as sessões de forma estritamente sequencial.
- [ ] Caso a sessão atual possua vagas livres, o participante é alocado nela sem abrir novas sessões.
- [ ] Caso todas as sessões estejam cheias, uma nova sessão é criada no banco com o status `AVAILABLE`.
- [ ] Nunca criar uma sessão vazia desnecessariamente.
- [ ] Uma nova sessão somente poderá ser criada quando todas as sessões existentes do mesmo `time_slot` estiverem completamente ocupadas.
- [ ] Testes unitários validam a abertura sequencial de sessões (Cenários de 1 a 5 da especificação oficial).

# Critérios de Homologação

1. Executar testes de serviço: `npx vitest run scheduling.service.test.ts`.
2. Simular inscrições sequenciais em ambiente local e verificar no banco de dados se a criação de sessões adicionais só ocorre após o preenchimento total das anteriores.

# Evidências Esperadas

- Implementação do algoritmo de percurso e criação automática de sessões no `SchedulingService`.
- Testes unitários cobrindo a criação automática de sessão após esgotar capacidade.

# Product Vision

> Visão de longo prazo do PM Sessions.

O PM Sessions nasce como uma plataforma para orquestração de entrevistas em grupo utilizando Google Calendar.

No futuro, poderá evoluir para um orquestrador completo de processos seletivos e programas, centralizando todas as etapas operacionais em uma única plataforma.

---

## Visão de Evolução

### Processos

Gerenciar múltiplos processos seletivos independentes.

---

### Pipeline

Organizar as diferentes etapas de um processo (inscrição, prova, entrevista, dinâmica, resultado, etc.).

---

### Workspaces

Agrupar funcionalidades por contexto de trabalho, facilitando a operação da equipe.

---

### Analytics

Disponibilizar indicadores e métricas operacionais em tempo real.

---

### Automações

Automatizar comunicações, lembretes e tarefas repetitivas.

---

### Inteligência Artificial

Auxiliar na operação, análise de dados e suporte às decisões.

---

## Princípio

O MVP deve permanecer simples e focado na resolução do problema principal.

Todas as funcionalidades desta visão serão avaliadas após a validação do MVP.

---

## Princípios de Modelagem

Durante a evolução do produto, as entidades do domínio deverão representar conceitos de negócio e não apenas funcionalidades da interface.

Exemplos:

- **Administrator** → usuário responsável pela operação da plataforma.
- **Candidate** → pessoa participante de um processo seletivo.
- **Participant** → representação do candidato dentro de uma Session.
- **Time Slot** → horário disponível para realização de entrevistas.
- **Session** → entrevista pertencente a um Time Slot.

Essa separação permite que o produto evolua para múltiplos tipos de processos sem necessidade de refatorações estruturais.

# Sprint Plan

> Planejamento operacional do desenvolvimento do MVP do PM Sessions.

---

# Objetivo

Organizar o desenvolvimento do MVP em entregas incrementais, garantindo que cada Sprint possua objetivos claros, entregáveis verificáveis e critérios objetivos de conclusão.

---

# Cronograma

| Data  | Sprint       | Objetivo                              |
| ----- | ------------ | ------------------------------------- |
| 16/07 | Documentação | Finalizar documentação e planejamento |
| 17/07 | Sprint 1     | Infraestrutura                        |
| 18/07 | Sprint 2     | Core MVP                              |
| 19/07 | Sprint 3     | Operação e UX                         |
| 20/07 | Testes       | Testes integrados                     |
| 21/07 | Buffer       | Correções finais (se necessário)      |

---

# Sprint 1 — Infrastructure

## Objetivo

Preparar toda a infraestrutura necessária para o desenvolvimento.

---

## Entregável 1 — Bootstrap

### Deve estar pronto

- [x] Projeto Next.js criado
- [x] App Router configurado
- [x] TypeScript configurado
- [x] ESLint configurado
- [x] Prettier configurado
- [x] Estrutura de pastas conforme architecture.md
- [x] Projeto executando localmente

### Critério de Aceite

A aplicação inicia corretamente utilizando `npm run dev`.

---

## Entregável 2 — UI Foundation

### Deve estar pronto

- [x] Tailwind CSS configurado
- [x] Shadcn UI instalado
- [x] Tema inicial criado
- [x] Fonte configurada
- [x] Layout base criado
- [x] Componentes Button e Input funcionando

### Critério de Aceite

É possível criar páginas utilizando apenas componentes reutilizáveis.

---

## Entregável 3 — Banco de Dados

### Deve estar pronto

- [x] Projeto Supabase criado
- [x] Banco PostgreSQL disponível
- [x] Variáveis de ambiente configuradas
- [x] Conexão validada
- [x] Estrutura inicial criada
- [x] Tabelas principais criadas

### Critério de Aceite

A aplicação consegue gravar e consultar dados.

---

## Entregável 4 — Autenticação

### Deve estar pronto

- [x] Auth.js instalado
- [x] Login Google funcionando
- [x] Logout funcionando
- [x] Sessão persistida
- [x] Middleware protegendo rotas
- [x] Apenas administradores autorizados conseguem acessar o painel

### Critério de Aceite

O painel administrativo está protegido por autenticação.

---

## Entregável 5 — Google Calendar

### Deve estar pronto

- [ ] Projeto Google Cloud criado
- [ ] OAuth configurado
- [ ] Google Calendar API habilitada
- [ ] Google Meet habilitado
- [ ] Criação de evento via API funcionando

### Critério de Aceite

A aplicação cria um evento de teste com Google Meet automaticamente.

---

## Entregável 6 — Deploy

### Deve estar pronto

- [ ] Deploy na Vercel realizado
- [ ] Variáveis configuradas
- [ ] Ambiente de produção funcionando

### Critério de Aceite

A aplicação pode ser acessada publicamente.

---

# Definition of Done

- [ ] Infraestrutura completa
- [ ] Banco conectado
- [ ] Login funcionando
- [ ] Google Calendar integrado
- [ ] Deploy realizado
- [ ] Nenhum bloqueio para iniciar a Sprint 2

---

# Sprint 2 — Core MVP

## Objetivo

Implementar o fluxo completo de agendamento.

---

## Entregável 1 — Public Scheduling

### Deve estar pronto

- [ ] Calendário disponível
- [ ] Dias habilitados
- [ ] Horários disponíveis
- [ ] Seleção de horário

### Critério de Aceite

O candidato consegue selecionar um horário disponível.

---

## Entregável 2 — Session Allocation

### Deve estar pronto

- [ ] Time Slots funcionando
- [ ] Sessions criadas automaticamente
- [ ] Capacidade respeitada
- [ ] Nova Session criada somente quando necessário
- [ ] Distribuição sequencial funcionando

### Critério de Aceite

O algoritmo sempre aloca corretamente um participante.

---

## Entregável 3 — Participantes

### Deve estar pronto

- [ ] Cadastro
- [ ] Validação
- [ ] Persistência
- [ ] Associação à Session
- [ ] Convite enviado

### Critério de Aceite

O participante recebe o convite corretamente.

---

## Entregável 4 — Painel Administrativo

### Deve estar pronto

- [ ] Dashboard
- [ ] Gestão de horários
- [ ] Gestão de Sessions
- [ ] Lista de participantes
- [ ] Reagendamento
- [ ] Remoção de participantes

### Critério de Aceite

O administrador consegue operar todo o processo seletivo.

---

# Definition of Done

- [ ] Fluxo completo funcionando
- [ ] Convites enviados
- [ ] Google Calendar sincronizado
- [ ] Processo seletivo operacional

---

# Sprint 3 — Experience & Operations

## Objetivo

Preparar o MVP para utilização pela equipe da Pulse.

---

## Entregável 1 — Interface

### Deve estar pronto

- [ ] Dashboard refinado
- [ ] Calendário visual
- [ ] Loading
- [ ] Empty States
- [ ] Toasts
- [ ] Mensagens de erro
- [ ] Responsividade

### Critério de Aceite

A interface pode ser utilizada sem treinamento.

---

## Entregável 2 — Exportação

### Deve estar pronto

- [ ] Exportação CSV
- [ ] UTF-8
- [ ] Colunas padronizadas
- [ ] Compatível com Excel e Google Sheets

### Critério de Aceite

A equipe consegue exportar listas de participantes.

---

## Entregável 3 — Validação Final

### Deve estar pronto

- [ ] Testes integrados
- [ ] Correção de bugs críticos
- [ ] Revisão da documentação
- [ ] Homologação interna

### Critério de Aceite

O MVP está apto para utilização em um processo seletivo real.

---

# Design Guidelines

Durante o desenvolvimento do MVP, todas as telas deverão seguir os princípios definidos em `docs/product/ui-foundation.md` (a ser criado).

Até sua definição, utilizar como referência:

- Google Calendar
- Calendly
- Linear
- Vercel Dashboard
- Stripe Dashboard

Priorizar:

- simplicidade;
- clareza;
- consistência visual;
- poucos cliques;
- feedback imediato ao usuário.

---

# Definition of Done do MVP

O MVP será considerado concluído quando:

- [ ] Todas as Specifications forem implementadas
- [ ] Todas as integrações estiverem funcionando
- [ ] A equipe conseguir operar um processo seletivo completo
- [ ] O deploy estiver disponível em produção
- [ ] A documentação estiver sincronizada

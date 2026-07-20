# Fluxo de Integração — Agendamento Público

Este documento descreve a cadeia operacional e responsabilidades de orquestração do fluxo de agendamento público (`001-public-scheduling`), integrado na rota `/scheduling` a partir do ciclo RC-4.1.

---

## 1. Mapeamento do Fluxo

O fluxo de dados e ações ocorre de forma unidirecional, desde a listagem inicial até a submissão e feedback do candidato:

```
[AvailableSlotsContainer]
           │
           ▼ (1. Usuário seleciona um horário)
   [onSelectSlot(slot)]
           │
           ▼ (2. Dispara Server Action)
[getSessionBySlotAction(slot.id)]
           │
           ▼ (3. Retorna a sessionId correspondente)
      [sessionId]
           │
           ▼ (4. Carrega o formulário e inputs)
    [SchedulingForm]
           │
           ▼ (5. Usuário clica em Confirmar)
[scheduleSessionAction(data)]
           │
           ▼ (6. Transição visual e feedback)
 [Resultado do Agendamento] (Sucesso/Erro)
```

---

## 2. Responsabilidades das Camadas

### Camada de Rota & Roteamento (App Router)

- **`app/scheduling/page.tsx`**: Orquestrador principal. Cuida do estado de seleção de horários (`selectedSlot`), da busca assíncrona da `sessionId` associada ao slot e da exibição condicional do formulário. Em telas móveis (abaixo do breakpoint `md`), gerencia o ciclo de exibição do **Bottom Sheet** e bloqueia o scroll do fundo da página.

### Camada de Componentes de Apresentação (UI)

- **`AvailableSlotsContainer`**: Renderiza skeletons de loading ou a listagem real chamando a Server Action `getAvailableSlotsAction` no mount da página.
- **`TimeSlotList` & `TimeSlotCard`**: Componentes burros que apenas exibem horários agrupados de forma responsiva.
- **`SchedulingForm`**: Captura e valida dados de Nome, E-mail e Telefone. Integra `useTransition` para loadings e controle local contra double submit. Renderiza o feedback final de agendamento confirmado (sucesso) ou os erros de negócio correspondentes.

### Camada de Orquestração Server-Side (Server Actions)

- **`getAvailableSlotsAction`**: Busca slots abertos futuros baseados em fuso horário de Brasília.
- **`getSessionBySlotAction`**: Busca a primeira sessão ativa e com vagas disponíveis associada ao slot.
- **`scheduleSessionAction`**: Valida a estrutura Zod, consome vagas e registra o participante.

---

## 3. Estratégia de Mocks locais (Desenvolvimento)

Em ambiente local (`development`), as Server Actions interceptam os dados simulados caso a base física esteja vazia:

- **Slots de Teste**: `mock-slot-1` (OPEN - com vagas) e `mock-slot-2` (FULL - esgotado).
- **Emails especiais de Testes de Erros**:
  - `error@example.com` -> Força erro de vagas esgotadas.
  - `duplicate@example.com` -> Força erro de participante já cadastrado.

# Task-01: Criar Rota e Página de Agendamento Público

[← Voltar para RC](../README.md) | [Próxima Task →](task-02.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Criar a rota oficial de agendamento público (`/scheduling`) e a página correspondente integrada ao App Router do Next.js. A página deve orquestrar a seleção de horários e a exibição do formulário de agendamento.

# Contexto

A RC-4 implementou os componentes visuais de forma isolada, mas não os expôs em uma página real. Esta tarefa cria o ponto de entrada da funcionalidade, permitindo que o usuário acesse a rota no navegador, visualize os skeletons de carregamento, selecione horários disponíveis e acesse o formulário.

# Dependências

- **RC-4** concluído e homologado.

# Arquivos que serão criados/alterados

- **Criar**: `apps/web/src/app/scheduling/page.tsx`
- **Criar**: `apps/web/src/features/scheduling/actions/get-session-by-slot.ts` (ou expor de forma similar para obter `sessionId` a partir de `timeSlotId`)

# Arquivos que NÃO podem ser alterados

- **Não alterar**: Lógica de regras de negócio em `scheduling.service.ts` ou repositórios (exceto para consumo).

# Ordem de Implementação

1. **Server Action**: Criar a action `getSessionBySlotAction(timeSlotId: string)` no diretório `features/scheduling/actions/` para consultar as sessões ativas (`AVAILABLE`) associadas ao slot.
2. **Página Next.js**: Criar a página `apps/web/src/app/scheduling/page.tsx` utilizando `'use client'`.
3. **Orquestração**:
   - Inicialmente, renderiza o `<AvailableSlotsContainer>` para exibir os horários.
   - Quando um slot é selecionado, busca a `sessionId` correspondente usando a Server Action criada.
   - Enquanto busca, exibe um estado de loading sutil.
   - Ao obter a `sessionId`, renderiza o `<SchedulingForm>` logo abaixo ou em substituição.
   - Trata o cancelamento limpando o slot selecionado.

# Checklist Técnico

- [ ] Criar Server Action `getSessionBySlotAction` que invoca `sessionRepository.findOpenSessionsByTimeSlot` via factory.
- [ ] Criar a página de rota `apps/web/src/app/scheduling/page.tsx`.
- [ ] Integrar os componentes de UI (`AvailableSlotsContainer` e `SchedulingForm`) controlando o estado de seleção e de exibição do formulário.
- [ ] Garantir carregamento assíncrono seguro.

# Critérios de Aceite

- [ ] A URL `/scheduling` abre corretamente no navegador local.
- [ ] Selecionar um slot de horário dispara a busca de sessão e exibe o formulário de agendamento.
- [ ] Clicar em "Cancelar" no formulário remove a seleção e oculta o formulário.
- [ ] Erros de carregamento de sessão são tratados e exibidos amigavelmente.

# Como Testar

1. Iniciar o servidor local: `npm run dev`.
2. Acessar `http://localhost:3000/scheduling` no navegador.
3. Validar se o skeleton de carregamento aparece antes da listagem.
4. Clicar em um horário e verificar se o formulário aparece.

# Rollback

- Reverter commits da task e excluir o diretório `app/scheduling`.

# Riscos

- **TimeSlot sem Sessão**: Se um time_slot estiver `OPEN` mas não tiver nenhuma sessão no banco, a action retornará um array vazio. A interface deve tratar isso mostrando uma mensagem amigável (ex: "Este horário não possui sessões ativas.").

# Definition of Done

- [ ] Compila sem erros de tipagem.
- [ ] Lint estático aprovado.
- [ ] Testes de compilação da página aprovados.

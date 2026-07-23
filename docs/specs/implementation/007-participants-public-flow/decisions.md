# Decisões Arquiteturais — RC-007 (Public Participant Flow)

Este documento registra as decisões arquiteturais estabelecidas para o fluxo público de candidatos e sincronização.

## 1. Remoção Definitiva de Horários Mockados

- **Decisão**: Todos os horários mockados em ambiente de desenvolvimento foram permanentemente excluídos do arquivo [get-available-slots.ts](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/apps/web/src/features/scheduling/actions/get-available-slots.ts).
- **Justificativa**: Evitar inconsistências entre ambientes de desenvolvimento e produção, garantindo que o banco de dados seja a única fonte de verdade. Quando não há horários cadastrados, o sistema exibe corretamente um estado vazio (`Empty State`).

## 2. Tratamento de Concorrência & SESSION_FULL

- **Decisão**: Interceptação explícita do erro SQL `P0001` retornado pela RPC do Supabase, mapeando-o para a exceção `SESSION_FULL`.
- **Justificativa**: Permite diferenciar falhas técnicas genéricas de falhas de concorrência de negócios (vaga esgotada durante o preenchimento), permitindo que o frontend exiba um banner vermelho descritivo e amigável.

## 3. Idempotência e Bloqueio de E-mail Duplicado

- **Decisão**: Introduzir uma verificação prévia no serviço (`existsConfirmedParticipant`) antes de invocar a RPC.
- **Justificativa**: A RPC do Supabase possui idempotência padrão que retorna a inscrição existente sem estourar erro no banco de dados. Para evitar que o frontend exiba um falso sucesso ao candidato que já está inscrito, fazemos a checagem explícita no backend e lançamos o erro `EMAIL_ALREADY_REGISTERED` a tempo.

## 4. Persistência de Telefone sem Máscara

- **Decisão**: A formatação do telefone `(XX) XXXXX-XXXX` ou `(XX) XXXX-XXXX` ocorre unicamente na máscara visual do client-side. Antes da gravação no Supabase, a string é sanitizada contendo somente dígitos numéricos.
- **Justificativa**: Padroniza os registros no banco de dados e simplifica integrações futuras de mensageria (como WhatsApp ou SMS).

## 5. Sincronização Inteligente Dashboard ⇄ Agendamento

- **Decisão**:
  - **Revalidação de Rotas**: O cache do Next.js é invalidado utilizando `revalidatePath` em todas as Server Actions que modificam horários ou participantes.
  - **Polling Leve no Agendamento**: Um polling de 3 segundos com diff inteligente (`areSlotsEqual`) é executado na tela pública de horários para atualizar a UI apenas quando houver mudanças reais de vagas ou status.
  - **Remoção de Polling do Admin**: O Dashboard do Administrador não executa polling periódico para maximizar a velocidade do CRUD e evitar loops de recarregamento no Next.js.

## 6. Infraestrutura Google Preparada

- **Decisão**: Os badges de status do Google Calendar e Meet no Dashboard do Administrador exibem `"Calendar/Meet aguardando configuração"` em tom de atenção (âmbar) enquanto as chaves de integração não estiverem totalmente configuradas em produção.
- **Justificativa**: Evita a confusão de falsos alertas de erro operacional vermelho (`Calendar erro`) para os organizadores em ambientes de staging/homologação.

## 7. UX Premium e Compacta na Confirmação

- **Decisão**: A tela de sucesso foi reprojetada para se encaixar de forma compacta como summary card lateral em desktop (sem barras de rolagem internas ou max-height rígido).
- **Justificativa**: Melhora drasticamente o apelo estético seguindo o design system do projeto com fontes `text-xs`/`text-base` e espaçamentos contidos.

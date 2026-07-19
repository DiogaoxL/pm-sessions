# 001 — Public Scheduling

> Especificação da funcionalidade de agendamento público de sessões.

---

# Status

🟢 Approved & Refined

---

# Objetivo

Permitir que um candidato realize o agendamento de uma entrevista em grupo de forma totalmente online, utilizando apenas um link público.

Ao concluir o processo com sucesso, o participante deverá estar associado automaticamente à sessão correta no banco de dados e adicionado como convidado no evento correspondente no Google Calendar, com recebimento do convite oficial por e-mail contendo o link do Google Meet.

---

# Contexto

O processo de alocação de candidatos em dinâmicas de grupo é operacionalmente complexo, envolvendo controle manual de limites de salas e envio descentralizado de convites. O **Public Scheduling** centraliza esta inteligência, abstraindo a alocação de sessões e integrando diretamente com a API do Google Calendar.

---

# Escopo

### O candidato poderá:

- Acessar o link público de agendamento.
- Visualizar os dias disponíveis no calendário (limitado a datas com `time_slots` ativos e com status `'OPEN'`).
- Visualizar os horários disponíveis em cada dia.
- Selecionar um horário e preencher o formulário de cadastro (Nome, E-mail e Telefone).
- Confirmar o agendamento e receber confirmação visual em tempo real.

### O sistema deverá:

- Carregar dinamicamente a disponibilidade agregada de vagas por slot.
- Alocar o candidato na sessão correta respeitando as regras de concorrência e capacidade.
- Garantir transações atômicas (banco de dados e Google Calendar API).
- Atualizar a capacidade da sessão (`current_participants`) e o status da sessão/slot.
- Enviar o convite oficial do Google Calendar com o link do Google Meet.

---

# Fora do Escopo

- Autenticação ou login para o candidato.
- Interface administrativa para alteração de agendamentos pelo candidato.
- Painel para cancelamento ou reagendamento direto pelo candidato (tratado offline nesta versão).

---

# Fluxos de Usuário

## Fluxo Principal (Caminho Feliz)

1. O candidato acessa a URL pública.
2. O sistema exibe o calendário e os horários em fuso horário padrão de Brasília (UTC-3).
3. O candidato seleciona uma data e um horário disponível.
4. O candidato preenche os dados (Nome, E-mail e Telefone) e clica em "Confirmar".
5. O sistema processa a reserva, cria o registro do participante, adiciona-o ao evento do Google Calendar e exibe uma tela de sucesso.

## Fluxo Alternativo A: Vaga Esgotada Durante o Preenchimento

1. O candidato seleciona um horário que possui apenas 1 vaga restante.
2. O candidato inicia o preenchimento do formulário.
3. Enquanto preenche, outro candidato conclui a reserva para o mesmo horário, esgotando a última sessão disponível.
4. Ao clicar em "Confirmar", o sistema detecta que o horário está lotado.
5. O sistema impede a gravação, reverte a operação e exibe uma mensagem: _"Desculpe, a última vaga para este horário foi preenchida. Por favor, selecione outro horário."_
6. O candidato é redirecionado para a tela de seleção de horários atualizada.

## Fluxo Alternativo B: E-mail Duplicado no Mesmo Time Slot

1. O candidato preenche o formulário com um e-mail que já está registrado e ativo (`status = 'CONFIRMED'`) em uma sessão para o mesmo `time_slot_id`.
2. Ao clicar em "Confirmar", o sistema valida a duplicidade.
3. A inscrição é rejeitada e o formulário exibe o alerta: _"Você já possui um agendamento confirmado para este horário."_

---

# Regras de Negócio & Regras Implícitas

## RN-001: Filtro de Disponibilidade

- Apenas `time_slots` com `status = 'OPEN'` e que possuam pelo menos uma sessão relacionada com `current_participants < capacity` e `status = 'AVAILABLE'` devem ser exibidos na interface pública.

## RN-002: Lógica de Alocação de Sessões (Round-Robin Determinístico)

- Quando o candidato seleciona um horário (`time_slot`), o sistema busca as sessões associadas.
- Para evitar sobrecarga em um único organizador e garantir a concorrência correta, o sistema aloca o participante na sessão disponível cuja string de `organizer_email` seja a primeira em ordem alfabética.
- O candidato **nunca** visualiza as sessões individuais ou os dados dos organizadores na interface pública. Ele visualiza apenas o horário unificado.

## RN-003: Transição Automática de Status

- Quando uma sessão atinge a capacidade (`current_participants = capacity`), seu status é alterado para `'FULL'`.
- Se todas as sessões vinculadas a um `time_slot` estiverem com status `'FULL'`, o status do `time_slot` correspondente deve ser atualizado automaticamente para `'FULL'`, ocultando-o de novas buscas.

## RN-004: Validação de Campos do Formulário

- **Nome**: Obrigatório, mínimo de 3 e máximo de 100 caracteres alfabéticos.
- **E-mail**: Obrigatório, formato de e-mail válido conforme regex padrão RFC 5322.
- **Telefone**: Obrigatório, formato celular brasileiro válido (ex: `(XX) 9XXXX-XXXX`).

## RN-005: Fuso Horário Unificado

- Todos os horários de agendamento são persistidos e processados sob o fuso horário `America/Sao_Paulo` (UTC-3). A interface pública deve exibir de forma explícita uma observação indicando este fuso horário para evitar problemas de timezone com candidatos de outros estados.

---

# Trato de Edge Cases & Segurança

### 1. Race Conditions (Reserva Concorrente)

- Para evitar _overbooking_ em submits simultâneos, a query de atualização da capacidade da sessão deve incluir uma cláusula defensiva:
  ```sql
  UPDATE public.sessions
  SET current_participants = current_participants + 1
  WHERE id = :session_id AND current_participants < capacity;
  ```
- O backend deve validar se o número de linhas afetadas pelo update foi exatamente `1`. Caso seja `0`, significa que a sessão esgotou no milissegundo anterior, e a transação deve ser imediatamente abortada (Rollback).

### 2. Transação Atômica e Falha no Google Calendar

- O fluxo de confirmação deve ser atômico. Se o participante for gravado no banco de dados mas a chamada à API do Google Calendar falhar (ou expirar), o sistema deve:
  1. Efetuar o rollback da transação do banco de dados (revertendo o participante e o incremento da sessão).
  2. Logar o erro com o nível `[ERROR]` para auditoria técnica.
  3. Apresentar uma tela amigável de erro temporário ao candidato sugerindo tentar novamente.

---

# Critérios de Aceite (Testáveis)

- [ ] **Carregamento de Disponibilidade**: A interface exibe apenas datas e horários correspondentes a `time_slots` com status `'OPEN'` e sessões com vagas reais disponíveis.
- [ ] **Alocação Determinística**: Agendamentos sucessivos no mesmo horário preenchem sequencialmente as sessões disponíveis dos organizadores conforme a regra alfabética.
- [ ] **Sanitização e Validação**: O botão "Confirmar" permanece desabilitado ou exibe mensagens de erro em tempo real caso e-mail, telefone ou nome estejam fora dos padrões definidos na RN-004.
- [ ] **Prevenção de Duplicados**: O sistema rejeita o agendamento e exibe mensagem adequada se o mesmo e-mail tentar agendar duas vezes no mesmo slot.
- [ ] **Garantia de Não-Overbooking**: Testes de concorrência com submits paralelos comprovam que nenhuma sessão excede seu limite físico de `capacity`.
- [ ] **Resiliência a Falhas (Google API)**: Caso a API do Google Calendar seja simulada como indisponível, nenhuma gravação de dados do participante persiste no Supabase e a sessão não é incrementada.
- [ ] **Integração E2E**: Agendamento concluído com sucesso insere o registro em `public.participants` (vinculado à sessão correta), atualiza `current_participants`, insere o convidado no evento do Google Calendar e envia o convite com link do Google Meet.

---

# Plano de Implementação

## Etapa 1 — Interface e Validação (UX)

- Criar a página de agendamento público em `app/(public)/scheduling/page.tsx` (ou estrutura equivalente do App Router).
- Implementar calendário interativo com seletor de horários em fuso de Brasília.
- Desenvolver formulário de cadastro com validações de regex em tempo de digitação.

## Etapa 2 — Lógica de Alocação e Transação (Backend)

- Criar a Server Action de agendamento encapsulando as checagens e queries de escrita.
- Implementar a cláusula defensiva `AND current_participants < capacity` no update de sessões.
- Configurar o tratamento de erros e rollback transacional integrado com a chamada ao client do Google Calendar.

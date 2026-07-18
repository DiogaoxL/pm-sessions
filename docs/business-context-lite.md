# Business Context

> Documento de Contexto de Negócio

---

# Visão do Produto

O PM Sessions é uma plataforma web desenvolvida para automatizar a orquestração de entrevistas em grupo e sessões simultâneas, simplificando a operação da equipe da Pulse Mais e proporcionando uma experiência intuitiva para candidatos.

O produto utiliza o Google Calendar como agenda oficial e distribui automaticamente os participantes entre sessões paralelas de um mesmo horário, eliminando limitações presentes nas ferramentas tradicionais de agendamento.

---

# Problema de Negócio

A equipe da Pulse Mais realiza programas que possuem entrevistas como etapa obrigatória do processo seletivo.

O processo atual apresenta desafios operacionais:

- distribuição manual dos candidatos;
- criação manual das salas;
- envio manual dos links das entrevistas;
- dificuldade para acompanhar vagas disponíveis;
- impossibilidade de criar múltiplas sessões simultâneas utilizando ferramentas convencionais.

Esses fatores aumentam o tempo operacional e elevam a possibilidade de erros.

---

# Objetivos do Produto

O produto deverá:

- automatizar o processo de agendamento;
- reduzir atividades operacionais da equipe;
- permitir múltiplas sessões no mesmo horário;
- utilizar o Google Calendar como agenda oficial;
- enviar automaticamente os convites aos candidatos;
- proporcionar uma experiência semelhante às melhores ferramentas de agendamento do mercado.

---

# Personas

## Administrador

Responsável pela organização das entrevistas.

### Objetivos

- configurar horários;
- acompanhar inscrições;
- visualizar participantes;
- exportar listas;
- administrar sessões.

---

## Candidato

Pessoa inscrita em um programa da Pulse Mais.

### Objetivos

- escolher uma data disponível;
- escolher um horário;
- confirmar participação;
- receber automaticamente o convite.

---

# Jornada do Administrador

1. Realiza login com Google.
2. Autoriza acesso ao Google Calendar.
3. Visualiza seus horários disponíveis.
4. Configura capacidade por sessão.
5. Configura quantidade máxima de sessões paralelas.
6. Publica os horários.
7. Acompanha as inscrições.
8. Exporta participantes quando necessário.

---

# Jornada do Candidato

1. Acessa a página pública.
2. Visualiza calendário.
3. Escolhe uma data.
4. Escolhe um horário.
5. Preenche Nome.
6. Preenche E-mail.
7. Preenche Telefone.
8. Confirma o agendamento.
9. Recebe o convite do Google Calendar.

---

# Regras de Negócio

## RN-001

O administrador é responsável por definir os horários disponíveis para entrevistas.

---

## RN-002

Cada horário possui uma capacidade máxima de participantes por sessão.

Exemplo:

09:00

Capacidade: 4 participantes

---

## RN-003

Cada horário poderá possuir múltiplas sessões paralelas.

Exemplo:

09:00

Sala 1

Sala 2

Sala 3

---

## RN-004

O candidato nunca escolhe a sala.

A distribuição é totalmente automática.

---

## RN-005

Apenas uma sessão permanece aberta por vez.

Enquanto houver vagas na Sala 1, nenhuma outra sala poderá receber candidatos.

---

## RN-006

Ao atingir a capacidade máxima da sessão atual, o sistema deverá liberar automaticamente a próxima sessão.

---

## RN-007

Ao atingir o número máximo de sessões configuradas, o horário será considerado indisponível.

---

## RN-008

Cada sessão deverá possuir um evento próprio no Google Calendar.

---

## RN-009

Cada evento deverá possuir um Google Meet associado.

---

## RN-010

Após a confirmação do agendamento, o candidato deverá receber automaticamente o convite do Google Calendar.

---

## RN-011

Os participantes não poderão visualizar informações de outros participantes.

---

## RN-012

Somente administradores autenticados poderão visualizar participantes.

---

## RN-013

O administrador poderá remover participantes de uma sessão.

Após a remoção, a vaga volta a ficar disponível.

---

## RN-014

O administrador poderá exportar os participantes de qualquer sessão.

---

## RN-015

A existência de eventos previamente cadastrados na agenda do entrevistador não impedirá a criação de novas Sessions.

O PM Sessions utilizará apenas os horários previamente disponibilizados pelo administrador como fonte oficial de disponibilidade. A agenda pessoal do entrevistador não determina automaticamente a disponibilidade dos horários publicados.

---

# Regras de Distribuição

O sistema sempre deverá preencher completamente uma sessão antes de iniciar a próxima.

Exemplo:

09:00

Sala 1

4/4

↓

Sala 2

0/4

↓

Sala 3

0/4

Nunca:

Sala 1

2/4

Sala 2

2/4

---

# Campos do Agendamento

Obrigatórios

- Nome
- E-mail
- Telefone

Opcional

- Observações

---

# Critérios de Aceite

## Agendamento

- o candidato consegue visualizar horários disponíveis;
- consegue concluir o agendamento;
- recebe o convite automaticamente.

---

## Distribuição

- participantes são distribuídos automaticamente;
- nenhuma sessão posterior recebe candidatos antes da anterior lotar.

---

## Administração

- administrador consegue visualizar participantes;
- consegue remover participantes;
- consegue exportar participantes.

---

# MVP

O MVP contempla:

- login Google;
- integração Google Calendar;
- integração Google Meet;
- calendário público;
- distribuição automática;
- painel administrativo;
- exportação CSV.

---

# Fora do MVP

- lista de espera;
- reagendamento pelo candidato;
- notificações WhatsApp;
- múltiplos calendários;
- aplicativo mobile;
- analytics avançado.

---

# Glossário

**Horário**

Faixa de tempo disponibilizada para entrevistas.

**Sessão**

Evento específico dentro de um horário.

**Capacidade**

Quantidade máxima de participantes de uma sessão.

**Administrador**

Usuário responsável pela gestão das entrevistas.

**Candidato**

Pessoa que agenda uma entrevista.

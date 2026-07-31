# Task 04: Criar Formulário de Agendamento Público

[← Voltar para RC](README.md) | [← Task Anterior](task-03.md) | [Próxima Task ➔](task-05.md)

---

# Objetivo

Construir o formulário interativo de coleta de informações do candidato (nome, e-mail, telefone opcional) para a realização do agendamento.

---

# Contexto

Uma vez selecionado um slot de horário na listagem, o formulário deve ser exibido para capturar as informações necessárias do participante para a confirmação da vaga.

---

# Dependências

- [Task 01](task-01.md)

---

# Arquivos que serão criados ou alterados

- **Criar**: `apps/web/src/features/scheduling/components/scheduling-form.tsx`

---

# Critérios de Aceite

1. Exibe inputs para Nome (obrigatório), E-mail (obrigatório) e Telefone (opcional).
2. Valida no lado do cliente (opcionalmente utilizando o mesmo schema Zod ou validação nativa de formulários) antes do envio.
3. Disponibiliza botões de ação para Confirmar Agendamento e Voltar/Cancelar.
4. Layout responsivo adequado para dispositivos móveis e desktops.

---

# Riscos

- Preenchimento incorreto de campos obrigatórios que podem passar para o servidor (mitigado forçando validações estritas no cliente).

---

# Definition of Done

O formulário está estruturado visualmente, coleta os inputs de forma correta e gerencia o estado local dos campos sem erros.

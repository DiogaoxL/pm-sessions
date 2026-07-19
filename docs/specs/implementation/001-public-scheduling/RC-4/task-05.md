# Task 05: Integrar Formulário com scheduleSessionAction

[← Voltar para RC](README.md) | [← Task Anterior](task-04.md) | [Próxima Task ➔](task-06.md)

---

# Objetivo

Integrar a submissão do formulário de agendamento com a Server Action `scheduleSessionAction`.

---

# Contexto

O formulário preenchido pelo candidato deve enviar os dados validados de forma assíncrona ao servidor e tratar a resposta de sucesso para finalizar o fluxo.

---

# Dependências

- [Task 04](task-04.md)

---

# Arquivos que serão criados ou alterados

- **Alterar**: `apps/web/src/features/scheduling/components/scheduling-form.tsx`

---

# Critérios de Aceite

1. Dispara a submissão utilizando a Server Action `scheduleSessionAction` com os payloads corretos (`name`, `email`, `phone`, `sessionId`, `timeSlotId`).
2. O botão de envio entra em estado desabilitado (disabled) e exibe feedback de carregamento durante a execução da action.
3. Se a Server Action retornar sucesso, a UI oculta o formulário e exibe uma tela ou modal de confirmação com os dados do agendamento concluído.

---

# Riscos

- Envios duplicados caso o usuário clique múltiplas vezes no botão (mitigado desabilitando o botão no estado pendente/loading).

---

# Definition of Done

A integração completa com a Server Action funciona, disparando o envio e atualizando o estado do componente com base no retorno de sucesso.

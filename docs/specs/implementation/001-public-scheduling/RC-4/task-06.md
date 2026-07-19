# Task 06: Tratamento de Estados, Loading e Mensagens de Erro

[← Voltar para RC](README.md) | [← Task Anterior](task-05.md) | [Próxima Task ➔](task-07.md)

---

# Objetivo

Refinar e garantir que todas as mensagens de erro (estruturais e de negócio) e loadings de transição sejam amigáveis e localizados na UI.

---

# Contexto

A experiência do usuário depende de bons feedbacks de erros. Nesta tarefa, mapearemos os erros do Zod (`validationErrors`) retornados pela Server Action diretamente em cima de cada input específico do formulário, bem como trataremos erros globais de domínio (reserva indisponível ou e-mail duplicado) em banners visuais (Alerts).

---

# Dependências

- [Task 03](task-03.md)
- [Task 05](task-05.md)

---

# Arquivos que serão criados ou alterados

- **Alterar**: `apps/web/src/features/scheduling/components/scheduling-form.tsx`

---

# Critérios de Aceite

1. Exibe os erros de validação retornados por `validationErrors.fieldErrors` nos inputs específicos (Nome, E-mail).
2. Erros globais retornados pela action (como "Esta sessão já não possui vagas disponíveis.") são exibidos em um componente Alert de feedback.
3. Garante que campos com erros sejam destacados visualmente (ex: borda vermelha e texto descritivo do erro).
4. Limpa estados de erro anteriores ao tentar submeter o formulário novamente.

---

# Riscos

- Exibição de erros de forma desorganizada ou poluindo o layout (mitigado usando placeholders de erro de tamanho fixo para evitar saltos de layout).

---

# Definition of Done

Todos os erros estruturais e globais são capturados das respostas das Server Actions e exibidos de forma polida nos locais adequados.

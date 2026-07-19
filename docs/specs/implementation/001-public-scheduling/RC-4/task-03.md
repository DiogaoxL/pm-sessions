# Task 03: Integrar Listagem com getAvailableSlotsAction

[← Voltar para RC](README.md) | [← Task Anterior](task-02.md) | [Próxima Task ➔](task-04.md)

---

# Objetivo

Integrar a listagem visual de horários com os dados reais retornados pela Server Action `getAvailableSlotsAction`.

---

# Contexto

O componente visual precisa de dados em tempo real. Esta tarefa consiste em criar um contêiner (Client Component ou Server Component) que invoca a Server Action ao montar a tela, trata o estado de carregamento e repassa a lista populada de slots para o `TimeSlotList`.

---

# Dependências

- [Task 02](task-02.md)

---

# Arquivos que serão criados ou alterados

- **Criar**: `apps/web/src/features/scheduling/components/available-slots-container.tsx`

---

# Critérios de Aceite

1. Dispara a chamada para `getAvailableSlotsAction()` na montagem da tela.
2. Exibe o `SchedulingSkeleton` enquanto a Server Action estiver buscando os dados.
3. Repassa os dados com sucesso para a renderização do `TimeSlotList`.
4. Trata e exibe erro adequado caso a Server Action falhe no carregamento.

---

# Riscos

- Perda de reatividade ou travamento da UI caso a requisição demore (mitigado usando states de pendência estruturados ou transições de carregamento do React 19).

---

# Definition of Done

A listagem exibe dados reais obtidos do banco por meio da Server Action e o tempo de carregamento é coberto visualmente por skeletons.

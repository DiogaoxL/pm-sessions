# Task 01: Criar Componentes Base de UI e Cards

[← Voltar para RC](README.md) | [Próxima Task ➔](task-02.md)

---

# Objetivo

Criar os componentes atômicos e estruturais básicos para o fluxo de scheduling público, garantindo consistência visual e encapsulamento de estilos.

---

# Contexto

Para construir a tela de agendamento público sem redundâncias, precisamos de pequenos blocos de UI reutilizáveis (como cards de horários, botões de ação e estados de esqueleto para loading), seguindo o sistema de estilo do Tailwind CSS v4.

---

# Dependências

- [RC-3 concluído](../RC-3/README.md)

---

# Arquivos que serão criados ou alterados

- **Criar**: `apps/web/src/features/scheduling/components/ui/time-slot-card.tsx`
- **Criar**: `apps/web/src/features/scheduling/components/ui/scheduling-skeleton.tsx`

---

# Critérios de Aceite

1. O `TimeSlotCard` exibe de forma clara o horário de início e fim formatado (ex: `10:00 - 11:00`), status de disponibilidade e capacidade de vagas.
2. O `SchedulingSkeleton` apresenta estados de carregamento fluidos usando animações pulse do Tailwind CSS para a listagem de horários e formulários.
3. Componentes devem utilizar tipagem estática rigorosa do TypeScript e evitar o uso de `any`.
4. Os novos componentes devem compilar sem erros estruturais (`typecheck` e `lint` limpos).

---

# Riscos

- Divergência visual com a identidade do projeto (mitigada utilizando utilitários padrões do Tailwind v4 definidos no monorepo).

---

# Definition of Done

Os componentes base estão codificados, tipados e integrados sem erros de compilação ou de análise de código.

# Admin Patterns

Este documento estabelece o padrão oficial de interface e fluxo para todas as telas administrativas da plataforma PM Sessions.

---

## 1. Grid e Espaçamentos

- **Grid Principal**: Layout de visualização baseado em `grid grid-cols-1 md:grid-cols-3 gap-6`.
- **Margens Internas (Paddings)**:
  - Containers de seção: `p-6` (24px).
  - Cards de métricas e cabeçalhos: `p-4` (16px).
- **Espaçamento entre Elementos (Gap)**:
  - Vertical: `space-y-4` ou `gap-4`.

---

## 2. Layout da Página Administrativa

O layout das páginas administrativas deve respeitar a estrutura:

```text
+-----------------------------------------------------------+
| [P] PM Sessions Dashboard                     Olá, Admin  | Header
+-----------------------------------------------------------+
|                                                           |
|  Visão Geral                                              | Title/Toolbar
|  Métricas e slots do sistema                              |
|                                                           |
|  [ Alertas / Banners de Permissões ]                      | Alert Area
|                                                           |
|  +--------------------+  +--------------------+           |
|  | Card 1             |  | Card 2             |           | Grid/Cards
|  +--------------------+  +--------------------+           |
|                                                           |
|  Time Slots e Sessões                                     | Section Header
|  +-----------------------------------------------------+  |
|  | Listagem Cronológica                                |  | Content List
|  +-----------------------------------------------------+  |
+-----------------------------------------------------------+
```

---

## 3. Toolbar Administrativa

Sempre localizada no topo das listagens ou seções principais, contendo:

- **Título**: Fonte `text-2xl font-bold tracking-tight`.
- **Descrição**: Fonte `text-sm text-neutral-400`.
- **Ação Principal (Primary Action)**: Botão posicionado no canto superior direito do grid ou container da Toolbar.

---

## 4. Cards de Estatística

- **Fundo**: `bg-neutral-900/50` ou `bg-neutral-900`.
- **Borda**: `border border-neutral-800`.
- **Conteúdo**:
  - Título/Label da métrica em cinza (`text-sm font-medium text-neutral-400`).
  - Valor principal em destaque (`text-2xl font-bold`).

---

## 5. Modais (Dialogs) e Diálogos de Confirmação

- **Confirmações de Remoção (Exclusão)**:
  - Título explícito: `"Tem certeza que deseja remover?"`.
  - Botão de confirmação de exclusão: Estilo destrutivo em vermelho (`bg-red-600 hover:bg-red-700 text-white`).
  - Botão de cancelamento: Estilo padrão (`bg-neutral-800 hover:bg-neutral-700`).

---

## 6. Feedbacks Reativos (Fluxo de UX)

Todas as interações destrutivas ou modificações de dados devem seguir rigorosamente o ciclo de feedback:

```text
[Ação do Usuário] ➔ [Dialog de Confirmação] ➔ [Loading Button / Spinner] ➔ [Server Action] ➔ [Toast Notification] ➔ [router.refresh() para atualizar dados]
```

---

## 7. Estados de Visualização Vazios (Empty State)

Sempre que uma lista ou consulta retornar vazia:

- Exibir ícone representativo centralizado;
- Título indicando a ausência de dados;
- Mensagem de descrição contextualizada;
- Botão (CTA) para criação ou atalho se for pertinente.

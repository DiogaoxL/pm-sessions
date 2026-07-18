# UX Principles

> Princípios oficiais de Experiência do Usuário (UX) do PM Sessions.

---

# Objetivo

Este documento define as regras de comportamento da interface do PM Sessions.

Seu objetivo é garantir consistência, previsibilidade e facilidade de uso em todas as funcionalidades do sistema.

Toda nova tela deverá seguir estes princípios antes de ser implementada.

---

# Filosofia do Produto

O PM Sessions é uma ferramenta operacional.

O usuário deve gastar seu tempo organizando entrevistas, e não aprendendo a utilizar a plataforma.

O sistema deve ser:

- simples;
- rápido;
- previsível;
- consistente;
- acolhedor.

---

# Princípios Fundamentais

## Simplicidade

Cada tela deve possuir apenas uma ação principal.

Evitar excesso de informações ou múltiplos fluxos concorrentes.

Sempre perguntar:

> "O que o usuário realmente precisa fazer nesta tela?"

---

## Clareza

Toda informação importante deve estar visível sem necessidade de múltiplos cliques.

Priorizar:

- títulos claros;
- descrições curtas;
- botões objetivos;
- mensagens simples.

---

## Velocidade

O usuário deve conseguir concluir qualquer tarefa com o menor número possível de interações.

Objetivos:

- poucos cliques;
- poucos formulários;
- poucos passos.

---

## Consistência

Componentes iguais devem sempre se comportar da mesma forma.

Exemplo:

- mesmo botão;
- mesma confirmação;
- mesma navegação;
- mesmo calendário;
- mesmo padrão de filtros.

---

# Navegação

A navegação principal será lateral.

Itens previstos:

- Dashboard
- Agenda
- Sessões
- Participantes
- Configurações

O menu deverá permanecer disponível durante toda a navegação administrativa.

---

# Hierarquia Visual

Toda tela deverá seguir a ordem:

1. Título
2. Descrição (quando necessário)
3. Ação principal
4. Conteúdo
5. Ações secundárias

---

# Calendário

O calendário é o elemento central do produto.

Diretrizes:

- visual limpo;
- leitura rápida;
- horários destacados;
- capacidade visível;
- status identificável por cores;
- abertura de detalhes em Drawer lateral.

Evitar modais para visualização de sessões.

---

# Formulários

Todos os formulários deverão possuir:

- Label
- Placeholder
- Validação em tempo real
- Mensagens claras
- Feedback imediato

Campos obrigatórios deverão ser identificados.

---

# Feedback do Sistema

Toda ação deverá gerar retorno ao usuário.

Exemplos:

- Loading
- Toast
- Confirmação
- Erro
- Sucesso

Nunca deixar o usuário sem resposta.

---

# Estados da Interface

Todos os componentes deverão prever:

- Loading
- Empty State
- Error State
- Success State
- Disabled State

---

# Empty States

Toda tela sem dados deverá explicar:

- o que aconteceu;
- por que aconteceu;
- qual ação o usuário deve realizar.

Exemplo:

"Nenhuma sessão criada."

Botão:

"Criar primeira sessão"

---

# Confirmações

Solicitar confirmação apenas para ações destrutivas.

Exemplos:

- excluir sessão;
- remover participante;
- cancelar entrevista.

Nunca confirmar ações reversíveis.

---

# Mensagens

A comunicação deverá seguir o tom institucional da Pulse.

Características:

- simples;
- acolhedora;
- objetiva;
- positiva.

Evitar mensagens técnicas.

Exemplo:

❌ Erro HTTP 500

✅ Não foi possível concluir esta ação. Tente novamente.

---

# Busca

Sempre que uma lista possuir grande volume de dados, oferecer:

- busca;
- filtros;
- ordenação.

---

# Tabelas

As tabelas deverão permitir:

- ordenação;
- pesquisa;
- paginação;
- seleção de linhas.

---

# Drawer

Drawers serão priorizados para:

- visualizar detalhes;
- editar registros;
- visualizar participantes.

Evitar modais grandes.

---

# Modais

Utilizar apenas para:

- confirmações;
- pequenas ações;
- avisos.

---

# Performance Percebida

Sempre que possível utilizar:

- Skeleton Loading;
- Lazy Loading;
- Transições suaves.

O sistema deve transmitir sensação de rapidez.

---

# Responsividade

Prioridade:

1. Desktop
2. Notebook
3. Tablet
4. Mobile

O MVP será otimizado principalmente para uso em computadores.

---

# Acessibilidade

Toda interface deverá possuir:

- navegação por teclado;
- foco visível;
- contraste adequado;
- labels acessíveis;
- suporte a leitores de tela.

---

# Fluxo Principal do Produto

O fluxo principal do PM Sessions deverá seguir sempre a mesma lógica:

Administrador

↓

Seleciona um horário

↓

Sistema identifica a próxima sessão disponível

↓

Participante é alocado automaticamente

↓

Google Calendar atualizado

↓

Google Meet criado (caso necessário)

↓

Convites enviados

↓

Sessão atualizada

Todo o fluxo deve ocorrer sem intervenção manual.

---

# Regras de Experiência

O sistema nunca deverá:

- exigir conhecimento técnico;
- expor informações desnecessárias;
- interromper o fluxo do usuário;
- solicitar dados repetidos;
- ocultar ações importantes.

---

# Princípio da Automação

Sempre que uma decisão puder ser tomada pelo sistema com segurança, ela deverá ser automatizada.

Exemplos:

- escolher automaticamente a próxima sala disponível;
- criar automaticamente o Google Meet;
- enviar automaticamente os convites;
- atualizar automaticamente o Google Calendar;
- impedir automaticamente excesso de participantes.

O usuário deverá apenas confirmar ações estratégicas.

O sistema será responsável pelas tarefas operacionais.

---

# Objetivo Final

Ao utilizar o PM Sessions, o usuário deve sentir que:

- organizar entrevistas é simples;
- o sistema trabalha por ele;
- há segurança nas ações realizadas;
- todas as informações estão sob controle.

A melhor interface é aquela que exige o menor esforço cognitivo possível.

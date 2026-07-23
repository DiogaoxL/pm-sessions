# Task 01: Validações de Formulário & Acessibilidade

# Objetivo

Assegurar que os inputs de dados cadastrais dos candidatos sejam limpos, válidos, formatados e totalmente acessíveis antes da submissão no formulário público.

# Escopo

- **Mascara de Telefone**: Inserir máscara visual dinâmica `(XX) XXXXX-XXXX` ou `(XX) XXXX-XXXX` no campo de telefone da UI. No envio da Server Action, remover formatações mantendo apenas dígitos numéricos.
- **Validação de E-mail**: Implementar regex rígido no client-side para validar a estrutura do e-mail.
- **Tratamento de Espaços**: Remover espaços em branco no início e fim de todos os campos de texto com `.trim()` antes da submissão.
- **Acessibilidade (a11y)**:
  - Adicionar `aria-live="polite"` nas mensagens de erro.
  - Utilizar `aria-describedby` para conectar o input à sua respectiva mensagem de erro inline.
- **Prevenção de Cliques Duplos & Edições Concorrentes**:
  - Desabilitar o botão de envio e exibir spinner visual durante a submissão.
  - Desabilitar todos os inputs do formulário durante o estado de loading do envio.

# Dependências

Nenhuma.

# Critérios de Aceite

- [ ] O número de telefone é salvo no banco contendo apenas dígitos (caracteres numéricos).
- [ ] Nenhum campo do formulário pode ser modificado durante o envio.
- [ ] Mensagens de erro de validação são anunciadas por leitores de tela automaticamente.

## UI Compliance

- [ ] Brand Guide seguido
- [ ] Design System seguido
- [ ] Component Library reutilizada
- [ ] Tokens utilizados
- [ ] UX Principles respeitados
- [ ] Accessibility validada
- [ ] Estados de Loading
- [ ] Estados de Erro
- [ ] Empty State
- [ ] Responsividade

# Critérios de Homologação

1. Digitar um e-mail inválido (ex: `teste@teste`) e tentar submeter. Verificar se o formulário bloqueia o envio e exibe erro.
2. Digitar espaços no início/fim do nome e enviar. Validar no banco de dados se os espaços foram removidos (`trim`).
3. Digitar um telefone com máscara. Validar se no banco de dados o registro foi salvo limpo (ex: `11999998888`).
4. Iniciar submissão do formulário e validar se os inputs e o botão de envio são desabilitados.

# Evidências Esperadas

- Sanitização de strings implementada no client-side.
- Inputs e mensagens de erro contendo os respectivos atributos ARIA.
- Estado desabilitado em todos os inputs durante loading.

# Observações

A sanitização do telefone para conter apenas dígitos deve ocorrer antes do envio à Server Action.

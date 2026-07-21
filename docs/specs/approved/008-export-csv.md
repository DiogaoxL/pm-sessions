# 007 — Export CSV

> Especificação da exportação de participantes por sessão.

---

# Status

🟢 Approved

---

# Objetivo

Permitir que administradores exportem a lista de participantes de uma Session ou de um Time Slot em formato CSV para utilização em controles internos, planilhas e processos operacionais.

---

# Contexto

Durante a realização dos programas, a equipe frequentemente necessita consultar, compartilhar ou manipular listas de participantes fora da aplicação.

A exportação deverá gerar arquivos simples, compatíveis com Microsoft Excel, Google Sheets e LibreOffice.

---

# Escopo

Esta Specification contempla:

- exportação por Session;
- exportação por Time Slot;
- geração de arquivo CSV;
- download imediato.

---

# Fora do Escopo

Esta Specification não contempla:

- exportação em PDF;
- exportação em XLSX;
- relatórios analíticos;
- envio automático por e-mail.

---

# Fluxo do Usuário

```text
Selecionar Session

↓

Exportar CSV

↓

Arquivo gerado

↓

Download
```

---

# Fluxo Técnico

```text
Receber solicitação

↓

Consultar participantes

↓

Montar CSV

↓

Disponibilizar download
```

---

# Regras de Negócio

## RN-001

Somente administradores autenticados poderão exportar dados.

---

## RN-002

O arquivo deverá conter apenas participantes da seleção realizada.

---

## RN-003

Cada linha representará um participante.

---

## RN-004

A ordem deverá seguir a ordem de inscrição.

---

## RN-005

O arquivo deverá utilizar UTF-8.

Separador:

```
;
```

(Compatível com Microsoft Excel e LibreOffice em ambiente pt-BR.)

---

## RN-006

O nome do arquivo deverá seguir o padrão:

```
participants-YYYY-MM-DD-HHMM.csv
```

Exemplo:

```
participants-2026-07-20-0900.csv
```

---

## Estrutura

| Coluna            | Descrição                                  |
| ----------------- | ------------------------------------------ |
| Nome              | Nome informado pelo candidato              |
| E-mail            | Utilizado para envio do convite            |
| Telefone          | Contato informado                          |
| Horário           | Time Slot da entrevista                    |
| Sessão            | Session atribuída (1, 2, 3...)             |
| Status            | Confirmado, Cancelado, Reagendado, Ausente |
| Data da Inscrição | Data e hora da confirmação                 |

---

## Exemplo

```csv
Nome;E-mail;Telefone;Horário;Sessão;Data da Inscrição
João Silva;joao@email.com;(11)99999-9999;09:00;1;2026-07-20 08:15
Maria Souza;maria@email.com;(11)98888-8888;09:00;1;2026-07-20 08:18
Pedro Lima;pedro@email.com;(11)97777-7777;09:00;2;2026-07-20 08:20
```

---

# Critérios de Aceite

- [ ] Exportação funcionando.
- [ ] UTF-8.
- [ ] Compatível com Excel.
- [ ] Compatível com Google Sheets.
- [ ] Apenas administradores.

---

# Plano de Implementação

(Plano padronizado)

---

# Checklist Técnico

- [ ] Consulta ao banco.
- [ ] Gerador CSV.
- [ ] Download.
- [ ] Validação de permissão.

---

# Dependências

- 003-session-allocation
- 004-admin-panel
- 005-authentication
- 006-participants

---

# Contrato de Negócio

## Entrada

Time Slot ou Session.

## Saída

Arquivo CSV contendo os participantes.

---

# Riscos

- Grande volume de dados.
- Falha de geração.
- Exportação por usuário não autorizado.

---

# Testes Esperados

## Cenário 1

Exportar uma Session.

Resultado esperado:

Arquivo contendo apenas os participantes da Session.

---

## Cenário 2

Exportar Time Slot.

Resultado esperado:

Arquivo contendo todas as Sessions do horário.

---

## Cenário 3

Usuário não autorizado.

Resultado esperado:

Exportação negada.

---

# Observações Técnicas

O CSV será gerado sob demanda, sem persistência em disco.

Os dados serão obtidos diretamente do banco de dados no momento da exportação.

---

# Definition of Done

A Specification será considerada concluída quando:

- exportação implementada;
- validação de permissões concluída;
- testes aprovados;
- documentação atualizada;
- revisão técnica concluída.

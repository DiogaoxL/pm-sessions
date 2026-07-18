# Foundation Specifications

> Especificações da infraestrutura técnica do PM Sessions.

---

# Objetivo

A pasta `foundation` reúne todas as Specifications responsáveis pela construção da fundação técnica da aplicação.

Essas Specifications definem a infraestrutura necessária para suportar o desenvolvimento das funcionalidades do produto.

Embora não representem funcionalidades de negócio, seguem o mesmo princípio de **Specification Before Code**, sendo aprovadas antes da implementação.

---

# Escopo

As Foundation Specifications abrangem:

- Bootstrap do projeto;
- Design Foundation;
- Banco de Dados;
- Configuração do Google Cloud;
- Autenticação;
- Deploy;
- Outras iniciativas estruturais da plataforma.

---

# Estrutura

```text
foundation/

000-bootstrap.md

001-design-foundation.md

002-supabase.md

003-google-cloud.md

004-authentication.md

005-deploy.md
```

---

# Fluxo

Cada Foundation Specification segue o seguinte ciclo:

```text
Draft
    ↓
Approved
    ↓
Implementação
    ↓
Validação
    ↓
Status: Implemented
```

Diferentemente das Specifications funcionais, os documentos da pasta `foundation` permanecem nesta pasta durante todo o ciclo de vida do projeto.

Após sua implementação, apenas o campo **Status** é atualizado para `Implemented`.

---

# Relação com as Product Specifications

As Foundation Specifications descrevem **como a plataforma é construída**.

As Product Specifications descrevem **o comportamento esperado das funcionalidades do sistema**.

Ambas seguem o mesmo processo de especificação, porém possuem objetivos diferentes.

---

# Ordem de Implementação

A implementação deverá seguir a sequência definida na Sprint Foundation.

1. Bootstrap
2. Design Foundation
3. Supabase
4. Google Cloud
5. Authentication
6. Deploy

---

# Critérios de Conclusão

Uma Foundation Specification será considerada concluída quando:

- implementação finalizada;
- build validada;
- lint aprovado;
- documentação sincronizada;
- implementation-log atualizado;
- critérios de aceite atendidos.

---

# Referências

- Sprint 1 Kickoff
- Architecture
- Architecture Decisions
- Database Schema
- Technical Context
- Specifications README

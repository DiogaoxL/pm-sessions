# Processo de Release

[← Voltar para Playbook](README.md)

---

O processo de publicação e release de novas versões da aplicação segue uma governança estruturada para evitar interrupções de serviço:

## Fluxo de Release

```text
RC Finalizado (Candidato a Release)
        │
        ▼
QA e Homologação em Ambiente Vercel Preview
        │
        ▼
Aprovação de Negócio e Homologação Técnica
        │
        ▼
Merge da branch release/vX.Y.Z na branch main
        │
        ▼
Deploy automático na Vercel (Produção)
        │
        ▼
Geração de Git Tag correspondente (ex: v0.2.0)
        │
        ▼
Atualização do Changelog geral do repositório
```

## Diretrizes de Entrega

- Deploys em produção só devem ocorrer a partir da branch principal (`main`).
- Cada merge em `main` deve vir acompanhado de uma tag do Git anotada com a listagem de features entregues.

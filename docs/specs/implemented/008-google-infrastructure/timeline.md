# Cronograma de Configuração — RC-008

Este documento descreve a ordem sequencial cronológica recomendada para a implantação segura da infraestrutura Google Calendar e Meet em ambiente de produção.

## Ordem de Implementação Recomendada

```
┌──────────────────────────┐      ┌──────────────────────────┐      ┌──────────────────────────┐
│   1. Configuração GCP    │ ───> │ 2. Tela de Consentimento │ ───> │  3. Criação de ID OAuth  │
└──────────────────────────┘      └──────────────────────────┘      └──────────────────────────┘
                                                                                  │
┌──────────────────────────┐      ┌──────────────────────────┐                    │
│ 6. Homologação & Go-Live │ <─── │  5. Vercel Env Setup     │ <─── 4. Geração do Refresh │
└──────────────────────────┘      └──────────────────────────┘      └──────────────────────────┘
```

---

### Fase 1: Criação e Ativação no Google Cloud Platform (GCP)

- **Objetivo**: Configurar o container de APIs.
- **Passos**:
  1. Criar projeto no Google Cloud Console com o nome `PM Sessions (Prod)`.
  2. Acessar a biblioteca de APIs e habilitar a **Google Calendar API**.
  3. Habilitar a **Google Meet API** (se requerido separadamente na organização institucional).

### Fase 2: Configuração da Tela de Consentimento OAuth

- **Objetivo**: Parametrizar a interface que o host verá no primeiro login.
- **Passos**:
  1. Definir o tipo de usuário. Se institucional (empresa com domínio Google Workspace), configurar como **User Type: Internal**. Se contas Gmail comuns, configurar como **User Type: External**.
  2. Adicionar escopos mínimos necessários:
     - `.../auth/calendar`
     - `.../auth/calendar.events`
  3. Adicionar os e-mails de teste autorizados (se em modo Sandbox/External).

### Fase 3: Criação das Credenciais Web Client

- **Objetivo**: Gerar as chaves de conexão da API.
- **Passos**:
  1. Acessar menu **Credenciais** -> **Criar Credenciais** -> **ID do cliente OAuth**.
  2. Tipo de aplicativo: **Aplicativo da Web**.
  3. Origens JavaScript Autorizadas: `https://<seu-dominio-prod>.vercel.app` e `http://localhost:3000`.
  4. URIs de Redirecionamento Autorizados: `https://<seu-dominio-prod>.vercel.app/auth/callback` e `http://localhost:3000/auth/callback`.
  5. Copiar o `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.

### Fase 4: Obtenção do Refresh Token Offline

- **Objetivo**: Capturar o token de longa duração.
- **Passos**:
  1. Utilizar a rota de autenticação administrativa do PM Sessions localmente ou no ambiente de staging com parâmetros de acesso offline ativos.
  2. Concluir o consentimento no navegador.
  3. Capturar o token gerado (persistido no banco de dados local ou impresso no console de logs) para obter o `GOOGLE_REFRESH_TOKEN`.

### Fase 5: Parametrização no Ambiente de Produção (Vercel)

- **Objetivo**: Integrar as chaves na hospedagem de produção.
- **Passos**:
  1. Acessar o Dashboard da Vercel para o projeto PM Sessions.
  2. Inserir as Environment Variables criptografadas:
     - Client ID, Secret, Refresh Token e Calendar ID.
  3. Realizar o Re-deploy da aplicação na Vercel para aplicar os novos segredos de infraestrutura.

### Fase 6: Homologação Final (Smoke Tests)

- **Objetivo**: Garantir o pleno funcionamento do agendamento real.
- **Passos**:
  1. Realizar uma inscrição pública de teste em produção.
  2. Validar no painel administrativo se o participante consta com badges verdes (indicando Calendar e Meet gerados com sucesso).
  3. Verificar a caixa de e-mail do Host e do Candidato confirmando o recebimento dos convites e links de videoconferência.

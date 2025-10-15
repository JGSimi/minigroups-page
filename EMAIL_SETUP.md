# Configuração do Sistema de Envio de Emails

Este documento descreve como configurar o sistema de envio de emails do formulário de contato usando o serviço **Resend**.

## Sumário

1. [Visão Geral](#visão-geral)
2. [Configuração do Resend](#configuração-do-resend)
3. [Configuração do Backend](#configuração-do-backend)
4. [Configuração do Frontend](#configuração-do-frontend)
5. [Deploy na Vercel](#deploy-na-vercel)
6. [Testando o Sistema](#testando-o-sistema)
7. [Troubleshooting](#troubleshooting)

---

## Visão Geral

### Como Funciona

1. Usuário preenche o formulário de contato no site
2. Frontend valida os dados e envia POST para `/api/contact`
3. Backend valida os dados com `express-validator`
4. Backend envia email via **Resend** para o email da empresa
5. Backend retorna sucesso/erro
6. Frontend mostra mensagem de confirmação

### Arquitetura

```
Frontend (React)
    ↓ POST /api/contact
Backend (Express)
    ↓ Validação + Sanitização
Resend API
    ↓ Envio de Email
Email da Empresa
```

### Recursos de Segurança

- Rate limiting: 5 requisições por 15 minutos por IP
- Validação e sanitização de todos os inputs
- Proteção contra XSS e injeção de código
- Headers de segurança (Helmet, CORS)
- Logs de todas as tentativas de envio

---

## Configuração do Resend

### Passo 1: Criar Conta no Resend

1. Acesse: https://resend.com/signup
2. Crie uma conta gratuita (100 emails/dia grátis)
3. Confirme seu email

### Passo 2: Adicionar Domínio (Recomendado)

Para emails profissionais, adicione seu domínio:

1. Vá em **Domains** no painel do Resend
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `minigroups.com`)
4. Configure os registros DNS fornecidos:
   - SPF
   - DKIM
   - DMARC (opcional, mas recomendado)

**Importante:** Sem domínio verificado, você pode usar emails de teste, mas eles podem não ser entregues corretamente.

### Passo 3: Obter API Key

1. Vá em **API Keys** no painel do Resend
2. Clique em **Create API Key**
3. Dê um nome (ex: "Mini Groups Production")
4. Selecione as permissões: **Send emails**
5. Copie a API Key (começa com `re_...`)

**Atenção:** Guarde esta chave em segurança! Ela só será exibida uma vez.

---

## Configuração do Backend

### Passo 1: Instalar Dependências

```bash
cd backend
npm install resend
```

### Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/`:

```env
# API Key do Resend
RESEND_API_KEY=re_sua_chave_aqui

# Email que receberá os contatos
CONTACT_EMAIL=contato@minigroups.com

# Outras variáveis...
NODE_ENV=production
FRONTEND_URL=https://minigroups.vercel.app
```

### Passo 3: Atualizar o Email de Envio (Opcional)

Se você configurou um domínio no Resend, atualize o email do remetente em:

**`backend/src/services/email.service.ts`**

```typescript
const result = await resend.emails.send({
  from: 'Mini Groups <contato@seudominio.com>', // ← Altere aqui
  to: toEmail,
  replyTo: email,
  subject: `🎮 Novo Contato: ${name}`,
  html: emailHtml,
});
```

### Passo 4: Testar Localmente

```bash
cd backend
npm run dev
```

Teste o endpoint:

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "gameLink": "https://www.roblox.com/games/123456",
    "message": "Olá, gostaria de saber mais sobre os serviços.",
    "ageConfirm": true
  }'
```

---

## Configuração do Frontend

### Passo 1: Configurar Variável de Ambiente

Edite o arquivo `.env.local` (desenvolvimento):

```env
VITE_API_URL=http://localhost:3001
```

Edite o arquivo `.env.production` (produção):

```env
VITE_API_URL=https://seu-backend.vercel.app
```

### Passo 2: Testar Localmente

```bash
npm run dev
```

Acesse `http://localhost:5173` e teste o formulário de contato.

---

## Deploy na Vercel

### Backend

#### Passo 1: Configurar Variáveis de Ambiente

No painel da Vercel, vá em:

**Settings → Environment Variables**

Adicione:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `RESEND_API_KEY` | `re_sua_chave_aqui` | Production |
| `CONTACT_EMAIL` | `contato@minigroups.com` | Production |
| `NODE_ENV` | `production` | Production |
| `FRONTEND_URL` | `https://minigroups.vercel.app` | Production |

#### Passo 2: Deploy

```bash
cd backend
vercel --prod
```

Anote a URL gerada (ex: `https://minigroups-backend.vercel.app`).

### Frontend

#### Passo 1: Atualizar URL da API

Edite `.env.production`:

```env
VITE_API_URL=https://minigroups-backend.vercel.app
```

#### Passo 2: Deploy

```bash
vercel --prod
```

---

## Testando o Sistema

### 1. Verificar Saúde do Serviço

```bash
curl https://seu-backend.vercel.app/api/contact/health
```

Resposta esperada:

```json
{
  "success": true,
  "data": {
    "configured": true,
    "status": "ready"
  }
}
```

### 2. Testar Envio de Email

Preencha o formulário no site ou use curl:

```bash
curl -X POST https://seu-backend.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "message": "Esta é uma mensagem de teste.",
    "ageConfirm": true
  }'
```

### 3. Verificar Email

Verifique a caixa de entrada do email configurado em `CONTACT_EMAIL`.

---

## Troubleshooting

### Email não está sendo enviado

**Problema:** Erro 503 ou "Email service not configured"

**Solução:**
- Verifique se a variável `RESEND_API_KEY` está configurada
- Confirme que a API Key é válida no painel do Resend
- Reinicie o servidor após adicionar variáveis de ambiente

### Email cai no spam

**Problema:** Emails são entregues, mas vão para spam

**Solução:**
- Configure SPF, DKIM e DMARC no seu domínio
- Use um domínio verificado no Resend
- Evite palavras como "free", "win", "urgent" no assunto

### Rate limit atingido

**Problema:** Erro "Too many requests"

**Solução:**
- Aguarde 15 minutos
- O limite é de 5 requisições por 15 minutos por IP
- Ajuste em `backend/src/routes/contact.ts` se necessário:

```typescript
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // ← Aumente o limite
  ...
});
```

### Erro CORS

**Problema:** "Origin not allowed by CORS"

**Solução:**
- Verifique se `FRONTEND_URL` no backend está correto
- Confirme que corresponde exatamente à URL do frontend
- Não inclua barra final na URL

### Validação falha

**Problema:** "Invalid email" ou outros erros de validação

**Solução:**
- Verifique se todos os campos obrigatórios estão preenchidos
- Email deve ser válido
- Mensagem deve ter entre 10 e 2000 caracteres
- Link do jogo (opcional) deve ser uma URL do Roblox válida

### Logs não aparecem

**Problema:** Não há logs no painel da Vercel

**Solução:**
- Logs aparecem em: Vercel Dashboard → Seu projeto → Functions
- Para desenvolvimento local, logs aparecem no terminal
- Verifique se `LOG_LEVEL` está configurado corretamente

---

## Arquivos Criados/Modificados

### Backend

- ✅ `backend/src/services/email.service.ts` - Serviço de envio de emails
- ✅ `backend/src/routes/contact.ts` - Rota da API de contato
- ✅ `backend/src/types/index.ts` - Tipos TypeScript
- ✅ `backend/src/index.ts` - Integração da rota
- ✅ `backend/.env.example` - Exemplo de variáveis de ambiente
- ✅ `backend/package.json` - Dependência `resend` adicionada

### Frontend

- ✅ `src/components/ContactSection.tsx` - Integração com API
- ✅ `.env.example` - Exemplo de variáveis de ambiente
- ✅ `.env.local` - Configuração de desenvolvimento
- ✅ `.env.production` - Configuração de produção

---

## Próximos Passos Recomendados

1. **Adicionar confirmação por email para o usuário:**
   - Enviar um email de confirmação para o remetente
   - Criar template de resposta automática

2. **Integração com CRM:**
   - Enviar dados para ferramentas como HubSpot, Salesforce, etc.
   - Armazenar contatos em banco de dados

3. **Analytics:**
   - Rastrear taxas de conversão do formulário
   - Monitorar taxa de entrega de emails

4. **Melhorias de UX:**
   - Adicionar captcha (hCaptcha ou reCAPTCHA)
   - Implementar honeypot fields contra bots

---

## Suporte

- **Resend Docs:** https://resend.com/docs
- **Resend Status:** https://status.resend.com
- **Suporte Resend:** support@resend.com

---

## Custos

### Resend - Plano Gratuito

- ✅ 100 emails/dia
- ✅ 3.000 emails/mês
- ✅ Domínios personalizados
- ✅ API completa

### Resend - Plano Pago (se necessário)

- **Pro:** $20/mês - 50.000 emails/mês
- **Business:** $85/mês - 250.000 emails/mês

Para maioria dos sites, o plano gratuito é suficiente!

---

**Data:** 2025-10-15
**Versão:** 1.0
**Autor:** Claude Code

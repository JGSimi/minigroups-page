# 🚀 Guia de Deploy Seguro no Vercel

Este guia fornece instruções passo a passo para fazer o deploy seguro do backend no Vercel.

## 📋 Pré-requisitos

- [ ] Node.js 18+ instalado
- [ ] Conta no Vercel
- [ ] Vercel CLI instalado: `npm install -g vercel`
- [ ] Git configurado

## 🔐 Passo 1: Verificar Segurança Local

Antes de fazer deploy, certifique-se de que tudo está funcionando localmente:

```bash
cd backend

# 1. Instalar dependências
npm install

# 2. Compilar TypeScript
npm run build

# 3. Verificar se há erros de tipo
npm run type-check

# 4. Verificar vulnerabilidades
npm audit

# 5. (Opcional) Corrigir vulnerabilidades
npm audit fix
```

## 🛠️ Passo 2: Configurar Variáveis de Ambiente

### 2.1. Criar arquivo .env local (para testes)

Copie o `.env.example` e preencha:

```bash
cp .env.example .env
```

Edite o `.env`:
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 2.2. Testar localmente

```bash
npm run dev
```

Acesse: `http://localhost:3001`

Você deve ver:
```json
{
  "message": "Mini Groups API - Backend dos Jogos do Roblox",
  "version": "2.0.0",
  "security": "Protected API",
  ...
}
```

## 🌐 Passo 3: Deploy no Vercel

### 3.1. Login no Vercel

```bash
vercel login
```

### 3.2. Deploy inicial (preview)

```bash
vercel
```

Siga as instruções:
- Link to existing project? **No**
- Project name: `minigroups-backend` (ou seu nome preferido)
- Directory: `./` (está na pasta backend)

### 3.3. Configurar Variáveis de Ambiente no Vercel

#### Opção A: Via CLI

```bash
# Ambiente de produção
vercel env add NODE_ENV production
vercel env add FRONTEND_URL production

# Cole a URL do seu frontend quando solicitado
# Exemplo: https://minigroups.vercel.app
```

#### Opção B: Via Dashboard (Recomendado)

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto: `minigroups-backend`
3. Vá em **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `NODE_ENV` | `production` | Production |
| `FRONTEND_URL` | `https://minigroups.vercel.app` | Production |

**Opcional (para autenticação adicional):**

| Nome | Valor | Ambiente |
|------|-------|----------|
| `API_KEY` | [gere uma chave] | Production |

Para gerar API_KEY:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4. Deploy de Produção

```bash
vercel --prod
```

Aguarde o build completar. Você receberá uma URL, por exemplo:
```
https://minigroups-backend.vercel.app
```

## ✅ Passo 4: Verificar Deploy

### 4.1. Testar endpoint principal

```bash
curl https://minigroups-backend.vercel.app
```

Resposta esperada:
```json
{
  "message": "Mini Groups API - Backend dos Jogos do Roblox",
  "version": "2.0.0",
  "security": "Protected API",
  ...
}
```

### 4.2. Testar endpoint de health

```bash
curl https://minigroups-backend.vercel.app/health
```

### 4.3. Testar API de games

```bash
curl https://minigroups-backend.vercel.app/api/games
```

### 4.4. Verificar Headers de Segurança

```bash
curl -I https://minigroups-backend.vercel.app/api/games
```

Verifique se estão presentes:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=...`
- `RateLimit-Limit: 60`

### 4.5. Testar CORS

```bash
curl -H "Origin: https://minigroups.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://minigroups-backend.vercel.app/api/games
```

Deve retornar headers CORS apropriados.

### 4.6. Testar Rate Limiting

Execute múltiplas requisições rápidas:

```bash
for i in {1..65}; do
  echo "Request $i"
  curl -s -o /dev/null -w "%{http_code}\n" https://minigroups-backend.vercel.app/api/games
done
```

Após 60 requisições, deve retornar `429 Too Many Requests`.

## 🔗 Passo 5: Conectar Frontend ao Backend

Atualize a variável de ambiente do frontend:

### 5.1. No projeto frontend

Edite `.env.production`:
```env
VITE_API_URL=https://minigroups-backend.vercel.app
```

### 5.2. Deploy do frontend

```bash
cd ..  # voltar para a raiz
vercel --prod
```

### 5.3. Testar integração

Acesse seu frontend e verifique se os dados carregam corretamente.

## 🐛 Troubleshooting

### Problema: CORS não funciona

**Sintoma:** Frontend não consegue fazer requisições, erro CORS no console.

**Solução:**
1. Verifique se `FRONTEND_URL` está configurada corretamente no Vercel
2. Certifique-se de que a URL no `.env.production` do frontend está correta
3. Verifique logs do Vercel: `vercel logs`

### Problema: Rate limit muito restritivo

**Sintoma:** Muitos erros 429 em desenvolvimento.

**Solução:**
Ajuste os limites em `backend/src/middleware/rateLimiter.ts`:

```typescript
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // aumentar limite
  ...
});
```

Depois, faça novo deploy.

### Problema: Logs não aparecem

**Sintoma:** Não vê logs no Vercel.

**Solução:**
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto
3. Vá em **Deployments** → selecione o deploy → **Functions** → **Logs**
4. Filtre por `[ERROR]` ou `[SECURITY]`

### Problema: Build falha

**Sintoma:** Erro durante `vercel --prod`.

**Solução:**
1. Execute localmente: `npm run build`
2. Corrija erros TypeScript
3. Verifique se todas as dependências estão instaladas
4. Tente novamente

### Problema: Timeout de requisições

**Sintoma:** Erro 504 Gateway Timeout.

**Solução:**
Verifique se o timeout no `vercel.json` está adequado:
```json
{
  "functions": {
    "dist/index.js": {
      "maxDuration": 30
    }
  }
}
```

## 📊 Monitoramento

### Ver logs em tempo real

```bash
vercel logs --follow
```

### Ver logs de uma função específica

```bash
vercel logs --scope=production
```

### Filtrar logs de segurança

No dashboard do Vercel:
1. **Functions** → **Logs**
2. Filtro: `[SECURITY]`

## 🔄 Atualizar Backend

Quando fizer mudanças:

```bash
# 1. Testar localmente
npm run build
npm run dev

# 2. Commit
git add .
git commit -m "Atualizações de segurança"
git push

# 3. Deploy
cd backend
vercel --prod
```

## 🔐 Checklist Final de Segurança

Antes de considerar o deploy completo:

- [ ] ✅ Todas as variáveis de ambiente configuradas
- [ ] ✅ Build completo sem erros
- [ ] ✅ Rate limiting testado e funcionando
- [ ] ✅ CORS testado com frontend real
- [ ] ✅ Headers de segurança presentes nas respostas
- [ ] ✅ Endpoints principais respondendo corretamente
- [ ] ✅ Logs não expõem informações sensíveis
- [ ] ✅ Frontend conectado e funcionando
- [ ] ✅ Documentação atualizada (SECURITY.md)
- [ ] ✅ `.env` adicionado ao `.gitignore`
- [ ] ✅ Sem secrets commitados no Git

## 📞 Suporte

**Problemas técnicos:**
- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

**Problemas de segurança:**
- Leia: `SECURITY.md`
- Contato: [seu-email@exemplo.com]

---

## 🎉 Pronto!

Seu backend está protegido e funcionando no Vercel com:

✅ Rate limiting (proteção contra DDoS)
✅ Headers de segurança (Helmet)
✅ CORS restritivo
✅ Validação de inputs
✅ Detecção de ataques
✅ Logs seguros
✅ Timeout de requisições
✅ Limite de payload

**Próximos passos:**
1. Monitorar logs regularmente
2. Manter dependências atualizadas: `npm audit`
3. Revisar logs de segurança semanalmente
4. Considerar implementar WAF (Cloudflare, etc.)

---

**Última atualização:** 2025-01-XX
**Versão do Backend:** 2.0.0

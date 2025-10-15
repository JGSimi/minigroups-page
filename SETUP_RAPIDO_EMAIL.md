# Setup Rápido - Sistema de Email

## ⚡ Configuração em 5 Minutos

### 1. Criar Conta no Resend (2 min)

1. Acesse: https://resend.com/signup
2. Crie conta gratuita
3. Vá em **API Keys** → **Create API Key**
4. Copie a chave (começa com `re_...`)

### 2. Configurar Backend (1 min)

Crie arquivo `backend/.env`:

```env
RESEND_API_KEY=re_sua_chave_aqui
CONTACT_EMAIL=contato@minigroups.com
NODE_ENV=production
FRONTEND_URL=https://minigroups.vercel.app
```

### 3. Testar Localmente (2 min)

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend (novo terminal):**
```bash
npm run dev
```

Acesse http://localhost:5173 e teste o formulário!

---

## 🚀 Deploy na Vercel

### Backend

No painel da Vercel → **Settings** → **Environment Variables**, adicione:

- `RESEND_API_KEY`: sua chave do Resend
- `CONTACT_EMAIL`: email que receberá os contatos
- `NODE_ENV`: production
- `FRONTEND_URL`: URL do frontend (ex: https://minigroups.vercel.app)

```bash
cd backend
vercel --prod
```

Copie a URL gerada (ex: `https://minigroups-backend.vercel.app`)

### Frontend

Edite `.env.production`:

```env
VITE_API_URL=https://minigroups-backend.vercel.app
```

```bash
vercel --prod
```

Pronto! 🎉

---

## ✅ Verificar se Está Funcionando

### Teste 1: Saúde do Serviço

```bash
curl https://seu-backend.vercel.app/api/contact/health
```

Deve retornar:
```json
{
  "success": true,
  "data": {
    "configured": true,
    "status": "ready"
  }
}
```

### Teste 2: Enviar Email de Teste

Preencha o formulário no site ou:

```bash
curl -X POST https://seu-backend.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "message": "Mensagem de teste do sistema.",
    "ageConfirm": true
  }'
```

Verifique o email configurado em `CONTACT_EMAIL`!

---

## 📖 Documentação Completa

Para mais detalhes, veja: [EMAIL_SETUP.md](EMAIL_SETUP.md)

---

## ❓ Problemas Comuns

**Email não enviado?**
- Verifique se `RESEND_API_KEY` está configurada
- Confirme que a API Key é válida no painel do Resend

**Erro CORS?**
- Verifique se `FRONTEND_URL` no backend corresponde à URL do frontend

**Rate limit?**
- Aguarde 15 minutos (limite: 5 requisições/15min por IP)

---

## 💡 O que foi implementado?

✅ Serviço de email com Resend
✅ Rota `/api/contact` com validações robustas
✅ Rate limiting (5 req/15min)
✅ Sanitização de inputs (proteção XSS)
✅ Email formatado em HTML com design profissional
✅ Logs de tentativas de envio
✅ Frontend com loading states
✅ Tratamento de erros
✅ TypeScript com tipos completos

---

## 🎯 Próximos Passos (Opcional)

- [ ] Configurar domínio personalizado no Resend
- [ ] Adicionar email de confirmação para usuário
- [ ] Implementar captcha (hCaptcha/reCAPTCHA)
- [ ] Integrar com CRM (HubSpot, Salesforce)
- [ ] Adicionar analytics de conversão

---

**Custo:** 🆓 Grátis (100 emails/dia com Resend)

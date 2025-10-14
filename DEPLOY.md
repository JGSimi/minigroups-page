# 🚀 Guia de Deploy - Mini Groups

## Passo 1: Fazer Build do Backend

Primeiro, compile o backend TypeScript para JavaScript:

```bash
cd backend
npm run build
```

Verifique se a pasta `dist` foi criada com sucesso.

## Passo 2: Instalar Vercel CLI (se necessário)

```bash
npm install -g vercel
```

## Passo 3: Fazer Login no Vercel

```bash
vercel login
```

Escolha uma das opções de login (GitHub, GitLab, Bitbucket ou Email).

## Passo 4: Deploy do Backend

Ainda dentro da pasta `backend`:

```bash
vercel --prod
```

O Vercel vai perguntar algumas coisas:
- **Set up and deploy?** → Yes
- **Which scope?** → Escolha sua conta
- **Link to existing project?** → No
- **What's your project's name?** → `minigroups-api` (ou outro nome)
- **In which directory is your code located?** → `./` (já está em backend)

Após o deploy, o Vercel vai exibir a URL do backend, algo como:
```
https://minigroups-api-xxxxx.vercel.app
```

**COPIE ESSA URL!** Você vai precisar dela no próximo passo.

## Passo 5: Configurar Variável de Ambiente no Vercel

Depois do deploy, configure a variável de ambiente no Vercel:

```bash
# Substitua a URL pela URL do seu frontend (após deploy)
vercel env add FRONTEND_URL production
```

Quando perguntar o valor, cole a URL do seu frontend em produção.

Ou configure pelo dashboard:
1. Acesse https://vercel.com/dashboard
2. Clique no projeto `minigroups-api`
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   - **Name:** `FRONTEND_URL`
   - **Value:** URL do seu frontend (ex: `https://minigroups.vercel.app`)
   - **Environment:** Production

## Passo 6: Atualizar .env.production do Frontend

Volte para a raiz do projeto e edite o arquivo `.env.production`:

```bash
cd ..
nano .env.production
```

Substitua a URL pelo backend que você acabou de fazer deploy:

```env
VITE_API_URL=https://minigroups-api-xxxxx.vercel.app
```

Salve o arquivo (Ctrl+O, Enter, Ctrl+X no nano).

## Passo 7: Deploy do Frontend

Agora faça o deploy do frontend:

```bash
vercel --prod
```

O Vercel vai perguntar:
- **Set up and deploy?** → Yes
- **Which scope?** → Escolha sua conta
- **Link to existing project?** → No
- **What's your project's name?** → `minigroups` (ou outro nome)
- **In which directory is your code located?** → `./`

Após o deploy, você terá a URL do frontend, tipo:
```
https://minigroups-xxxxx.vercel.app
```

## Passo 8: Atualizar CORS no Backend

Agora que você tem a URL do frontend, precisa adicionar ela no backend:

1. Volte para o Vercel dashboard do backend
2. **Settings** → **Environment Variables**
3. Edite `FRONTEND_URL` e coloque a URL correta do frontend

Ou via CLI:

```bash
cd backend
vercel env rm FRONTEND_URL production
vercel env add FRONTEND_URL production
# Cole a URL do frontend quando perguntar
```

## Passo 9: Fazer Redeploy do Backend

Depois de atualizar a variável de ambiente:

```bash
vercel --prod
```

## Passo 10: Testar!

Abra a URL do frontend no navegador e veja se os dados estão carregando da API!

---

## 🔧 Comandos Úteis

### Ver logs do backend:
```bash
cd backend
vercel logs
```

### Deletar projeto:
```bash
vercel remove minigroups-api
```

### Ver lista de projetos:
```bash
vercel ls
```

---

## 🐛 Troubleshooting

### CORS Error ainda aparece

1. Verifique se `FRONTEND_URL` está configurada corretamente no Vercel
2. Certifique-se de que fez redeploy do backend após adicionar a variável
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Backend retorna 404

1. Verifique se o build foi feito: `cd backend && npm run build`
2. Certifique-se de que a pasta `dist` existe
3. Faça redeploy: `vercel --prod`

### Frontend não carrega dados

1. Abra o Console do navegador (F12)
2. Veja se a URL da API está correta
3. Teste a API diretamente: `https://seu-backend.vercel.app/api/games`

---

## 📱 Alternativa: Deploy via GitHub (mais fácil!)

Se preferir não usar CLI:

1. Faça commit e push do código para GitHub
2. Acesse https://vercel.com/new
3. Importe o repositório
4. Configure duas aplicações separadas:
   - Uma apontando para `/backend` (Backend)
   - Outra para raiz `/` (Frontend)
5. Configure as variáveis de ambiente no dashboard

---

## ✅ Checklist Final

- [ ] Backend compilado (`npm run build`)
- [ ] Backend no ar no Vercel
- [ ] Variável `FRONTEND_URL` configurada no backend
- [ ] `.env.production` atualizado com URL do backend
- [ ] Frontend no ar no Vercel
- [ ] Site carregando dados da API (sem dados mockados)
- [ ] Console sem erros de CORS

---

**Dúvidas?** Consulte a documentação do Vercel: https://vercel.com/docs

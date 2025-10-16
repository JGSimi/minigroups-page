# 🔒 Documentação de Segurança - Mini Groups API

## Visão Geral

Esta API implementa múltiplas camadas de segurança para proteger contra ataques comuns e garantir a integridade dos dados.

## 📋 Índice

- [Recursos de Segurança](#recursos-de-segurança)
- [Configuração no Vercel](#configuração-no-vercel)
- [Proteções Implementadas](#proteções-implementadas)
- [Rate Limiting](#rate-limiting)
- [CORS Policy](#cors-policy)
- [Melhores Práticas](#melhores-práticas)
- [Monitoramento](#monitoramento)
- [Reportar Vulnerabilidades](#reportar-vulnerabilidades)

---

## 🛡️ Recursos de Segurança

### 1. Headers de Segurança (Helmet)

A API usa **Helmet** para adicionar headers HTTP de segurança:

- **Content-Security-Policy**: Previne XSS definindo fontes confiáveis
- **X-Frame-Options**: DENY - Previne clickjacking
- **Strict-Transport-Security**: Força HTTPS (HSTS)
- **X-Content-Type-Options**: nosniff - Previne MIME sniffing
- **X-XSS-Protection**: Proteção XSS para navegadores antigos
- **Referrer-Policy**: Controla informações de referência
- **Permissions-Policy**: Restringe APIs de recursos sensíveis

### 2. Rate Limiting

Proteção contra ataques DDoS e abuso:

#### Rate Limit Geral
```
100 requisições por 15 minutos por IP
```

#### Rate Limit da API
```
60 requisições por 15 minutos por IP para /api/*
```

#### Rate Limit Estrito (se necessário)
```
10 requisições por minuto
```

**Headers retornados:**
- `RateLimit-Limit`: Número máximo de requisições
- `RateLimit-Remaining`: Requisições restantes
- `RateLimit-Reset`: Timestamp de reset do limite

### 3. CORS (Cross-Origin Resource Sharing)

Política restritiva de CORS:

**Origens Permitidas em Produção:**
- `https://minigroups.vercel.app`
- Variável de ambiente `FRONTEND_URL`

**Origens Permitidas em Desenvolvimento:**
- `localhost:*` (todas as portas)

**Configurações:**
- Credentials: Permitido
- Métodos: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Headers permitidos: Content-Type, Authorization, X-API-Key

### 4. Validação e Sanitização de Input

Todas as entradas são validadas e sanitizadas:

- **express-validator**: Validação de parâmetros
- **Sanitização automática**: Remove caracteres perigosos
- **Detecção de padrões de ataque**: SQL Injection, XSS, Path Traversal

**Padrões detectados:**
- SQL Injection: `', --, #, union, select, drop`
- XSS: `<script>`, event handlers, `javascript:`
- Path Traversal: `../`, `..%2F`
- Command Injection: `exec, eval, system`

### 5. Limites de Payload

Proteção contra payloads maliciosos grandes:

- **Tamanho máximo**: 100KB
- **Content-Type validado**: Apenas `application/json`
- **Timeout de requisição**: 30 segundos

### 6. Logging Seguro

Sistema de logging que não expõe informações sensíveis:

**Em Produção:**
- Logs estruturados em JSON
- Não exibe stack traces
- Redação automática de dados sensíveis (passwords, tokens, API keys)
- Apenas erros e requisições lentas são logadas

**Em Desenvolvimento:**
- Logs detalhados e coloridos
- Stack traces completos
- Todas as requisições são logadas

### 7. Proteção contra Ataques Comuns

- **SQL Injection**: Validação de inputs, sanitização
- **XSS (Cross-Site Scripting)**: CSP, sanitização de HTML
- **CSRF**: SameSite cookies (quando implementado)
- **Clickjacking**: X-Frame-Options DENY
- **MIME Sniffing**: X-Content-Type-Options nosniff
- **Command Injection**: Detecção de padrões
- **Path Traversal**: Validação de caminhos

---

## ⚙️ Configuração no Vercel

### 1. Deploy Inicial

```bash
cd backend
npm run build
vercel --prod
```

### 2. Configurar Variáveis de Ambiente

No dashboard do Vercel:
1. Vá em **Settings** > **Environment Variables**
2. Adicione as seguintes variáveis:

```env
NODE_ENV=production
FRONTEND_URL=https://minigroups.vercel.app
# API_KEY=gere_uma_chave_secreta_aqui (opcional)
```

**Para gerar API_KEY segura:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Configurações Recomendadas no Vercel

- **Region**: `gru1` (São Paulo) - Já configurado
- **Memory**: 1024 MB - Já configurado
- **Max Duration**: 30s - Já configurado
- **Node Version**: 20.x (recomendado)

### 4. Domínio Customizado (Opcional)

Se usar domínio próprio:
1. Configure o domínio no Vercel
2. Adicione o domínio em `FRONTEND_URL`
3. Atualize `/backend/src/config/cors.ts`

---

## 🔍 Proteções Implementadas

### Middleware Stack (Ordem de Execução)

```
1. Helmet          → Headers de segurança
2. CORS            → Validação de origem
3. Rate Limiting   → Proteção contra abuso
4. Payload Limit   → Limite de tamanho
5. JSON Parser     → Parse de body
6. Request Timeout → Timeout de 30s
7. Sanitize Headers→ Limpa headers sensíveis
8. Validate Origin → Valida origem em produção
9. Attack Detection→ Detecta padrões de ataque
10. Sanitize Input → Sanitiza todos os inputs
11. Content-Type   → Valida Content-Type
12. Request Logger → Loga requisições
```

### Validadores de Rotas

Validação específica por endpoint:

```typescript
// Exemplo: GET /api/games/:placeId
validateGameId → Valida que placeId é número válido

// Exemplo: GET /api/games?search=valor
validateGameQuery → Valida parâmetros de busca
```

---

## 📊 Rate Limiting

### Configuração Atual

| Tipo | Limite | Janela | Endpoints |
|------|--------|--------|-----------|
| Geral | 100 req | 15 min | Todos |
| API | 60 req | 15 min | `/api/*` |
| Estrito | 10 req | 1 min | (Não ativo) |

### Resposta de Rate Limit Excedido

```json
{
  "success": false,
  "error": "Muitas requisições. Por favor, aguarde antes de tentar novamente.",
  "retryAfter": 900
}
```

### Bypass de Rate Limit (Opcional)

Se configurar `API_KEY`, requisições com header válido ignoram rate limit:

```bash
curl -H "X-API-Key: sua_chave_aqui" https://api.example.com/api/games
```

---

## 🌐 CORS Policy

### Origens Permitidas

**Produção:**
```javascript
[
  'https://minigroups.vercel.app',
  process.env.FRONTEND_URL
]
```

**Desenvolvimento:**
```javascript
Todas as origens localhost:*
```

### Testar CORS

```bash
curl -H "Origin: https://minigroups.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://minigroups-backend.vercel.app/api/games
```

---

## ✅ Melhores Práticas

### Para Desenvolvedores

1. **Nunca commite secrets no Git**
   - Use `.env` para secrets locais
   - Configure no Vercel para produção
   - Mantenha `.env.example` atualizado

2. **Valide todos os inputs**
   - Use os validadores em `middleware/validators.ts`
   - Sanitize antes de usar dados
   - Nunca confie em dados do cliente

3. **Mantenha dependências atualizadas**
   ```bash
   npm audit
   npm update
   ```

4. **Use HTTPS sempre**
   - Vercel fornece HTTPS automaticamente
   - Force HSTS (já configurado)

5. **Implemente logging adequado**
   - Use o logger em `utils/logger.ts`
   - Não logue dados sensíveis
   - Monitore logs de segurança

### Para Deploy

1. **Antes do deploy:**
   ```bash
   npm run build
   npm run type-check
   ```

2. **Após deploy:**
   - Teste todos os endpoints
   - Verifique headers de segurança
   - Confirme rate limiting funcionando
   - Valide CORS

3. **Monitoramento contínuo:**
   - Verifique logs do Vercel
   - Monitore tentativas de ataque
   - Atualize configurações conforme necessário

---

## 📈 Monitoramento

### Logs de Segurança

Eventos monitorados:

1. **CORS Violations**
   ```
   [SECURITY] CORS violation - origem não permitida
   ```

2. **Rate Limit Exceeded**
   ```
   [SECURITY] Rate limit excedido por IP: xxx.xxx.xxx.xxx
   ```

3. **Padrões de Ataque**
   ```
   [SECURITY] Padrão de ataque detectado: SQL Injection
   ```

4. **Rotas Não Encontradas**
   ```
   [WARN] Rota não encontrada: GET /api/admin
   ```

### Verificar Logs no Vercel

1. Acesse o dashboard do Vercel
2. Vá em **Deployments** > Selecione o deploy
3. Clique em **Functions** > **Logs**
4. Filtre por `[SECURITY]` ou `[ERROR]`

### Métricas Importantes

- Taxa de requisições bloqueadas por rate limit
- Número de violações CORS
- Tentativas de ataque detectadas
- Tempo médio de resposta
- Taxa de erros 5xx

---

## 🚨 Reportar Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança:

1. **NÃO** abra uma issue pública no GitHub
2. Entre em contato diretamente com a equipe: **[seu-email@exemplo.com]**
3. Inclua:
   - Descrição detalhada da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestões de correção (se houver)

### Política de Divulgação Responsável

- Responderemos em até 48 horas
- Trabalharemos em uma correção
- Creditaremos o descobridor (se desejado)
- Divulgaremos após correção

---

## 🔐 Checklist de Segurança

Antes de ir para produção:

- [ ] Todas as variáveis de ambiente configuradas no Vercel
- [ ] FRONTEND_URL definida corretamente
- [ ] Testado rate limiting funcionando
- [ ] Validado CORS apenas permite origem correta
- [ ] Verificado headers de segurança no response
- [ ] Logs não expõem informações sensíveis
- [ ] Dependências atualizadas (`npm audit`)
- [ ] Build completo sem erros
- [ ] Testado todos os endpoints principais
- [ ] Documentação atualizada

---

## 📚 Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet Documentation](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Vercel Security](https://vercel.com/docs/security)

---

## 📝 Changelog de Segurança

### v2.0.0 (2025-01-XX)

**Implementado:**
- ✅ Helmet para headers de segurança
- ✅ Rate limiting em 3 níveis
- ✅ CORS restritivo
- ✅ Validação e sanitização de inputs
- ✅ Detecção de padrões de ataque
- ✅ Logging seguro
- ✅ Limites de payload
- ✅ Timeout de requisições
- ✅ Headers de segurança no Vercel

**Próximas melhorias:**
- 🔄 Sistema de API Keys
- 🔄 WAF (Web Application Firewall)
- 🔄 2FA para endpoints admin (se implementado)
- 🔄 Audit logs
- 🔄 IP Whitelist/Blacklist

---

## 📞 Suporte

Para questões de segurança: **[seu-email@exemplo.com]**

Para questões gerais: Abra uma issue no GitHub

---

**Última atualização:** 2025-01-XX
**Versão:** 2.0.0
**Mantenedor:** Mini Groups Studio

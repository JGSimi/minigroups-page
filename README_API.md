# Mini Groups - Integração com API do Roblox

## 🎉 Implementação Completa

Agora o site busca dados reais dos seus jogos do Roblox através de uma API backend!

## 📦 O Que Foi Implementado

### Backend (Nova API)

✅ Servidor Express + TypeScript na porta 3001
✅ Integração com 4 APIs diferentes do Roblox
✅ Sistema de cache inteligente (5 minutos)
✅ Fallback automático se API do Roblox falhar
✅ CORS configurado para o frontend
✅ Logs detalhados de todas as operações
✅ Tratamento robusto de erros

### Frontend (Atualizado)

✅ Hook `useGames` atualizado para consumir API
✅ Estados de loading e erro implementados
✅ Fallback para dados mockados se API falhar
✅ Variável de ambiente configurada
✅ Compatível com código existente

## 🚀 Como Usar

### 1. Iniciar o Backend

```bash
cd backend
npm install
npm run dev
```

Você verá:
```
╔════════════════════════════════════════╗
║   Mini Groups API - Servidor Rodando  ║
╚════════════════════════════════════════╝

🚀 Servidor iniciado na porta 3001
📍 URL: http://localhost:3001
```

### 2. Iniciar o Frontend

Em outro terminal:

```bash
npm run dev
```

O site estará disponível em: `http://localhost:5173`

## 📊 Dados Reais do Roblox

A API agora busca dados reais dos seus 3 jogos:

### 1. Mini City RP
- **Place ID:** 113494949872227
- **Categoria:** RP
- **Dados:** Jogadores online, visitas, likes/dislikes, descrição real

### 2. Make A BrainRot
- **Place ID:** 128160564290614
- **Categoria:** Casual
- **Dados:** Todos os dados atualizados em tempo real

### 3. Mini Shooters
- **Place ID:** 124863958602381
- **Categoria:** Action
- **Dados:** Estatísticas ao vivo do jogo

## 🔍 Testando a API

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Buscar Todos os Jogos
```bash
curl http://localhost:3001/api/games
```

### Buscar Jogo Específico
```bash
curl http://localhost:3001/api/games/113494949872227
```

## 📁 Estrutura Criada

```
minigroups/
├── backend/                    # Nova pasta com a API
│   ├── src/
│   │   ├── config/
│   │   │   └── games.ts       # IDs e configurações dos jogos
│   │   ├── routes/
│   │   │   └── games.ts       # Rotas da API
│   │   ├── services/
│   │   │   ├── cache.service.ts    # Sistema de cache
│   │   │   └── roblox.service.ts   # Integração Roblox
│   │   ├── types/
│   │   │   └── index.ts       # Tipos TypeScript
│   │   └── index.ts           # Servidor Express
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md              # Documentação da API
│
├── src/
│   ├── hooks/
│   │   └── useGames.ts        # ✨ Atualizado para usar API
│   └── ...
│
└── .env.local                 # ✨ Nova configuração
```

## 🎯 Funcionalidades do Backend

### 1. Cache Inteligente
- Evita rate limits da API do Roblox
- Cache de 5 minutos para dados dos jogos
- Cache de 60 minutos para Universe IDs e thumbnails
- Logs detalhados (Cache Hit/Miss)

### 2. Sistema de Fallback
Se a API do Roblox falhar:
- Retorna dados de fallback pré-configurados
- Site nunca fica sem dados
- Logs indicam quando fallback é usado

### 3. Múltiplas APIs do Roblox
Integra com 4 APIs diferentes:
- Conversão Place ID → Universe ID
- Detalhes dos jogos
- Votos (likes/dislikes)
- Thumbnails

### 4. Cálculos Automáticos
- **Rating:** `(likes / total) * 5`
- **isPopular:** `playersOnline >= 100,000`
- **featured:** Todos os 3 jogos marcados como featured

## 📝 Exemplo de Resposta

```json
{
  "success": true,
  "data": [
    {
      "id": "113494949872227",
      "title": "💸 Mini City RP",
      "description": "🏡 Mini City RP é um jogo...",
      "thumbnail": "https://tr.rbxcdn.com/.../512/512/Image/Png",
      "category": "RP",
      "playersOnline": 192,
      "visits": 1754757,
      "rating": 4.3,
      "isPopular": false,
      "createdAt": "2025-05-11T23:01:42.033Z",
      "lastUpdated": "2025-10-13T19:10:54.667Z",
      "tags": ["roleplay", "social", "city", "jobs", "economy"],
      "developer": "Mini Groups Studio",
      "featured": true,
      "url": "https://www.roblox.com/games/113494949872227"
    }
  ]
}
```

## 🔧 Comandos Úteis

### Backend
```bash
cd backend
npm run dev          # Desenvolvimento (hot reload)
npm run build        # Compilar TypeScript
npm start            # Produção
npm run type-check   # Verificar tipos
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
```

## 🐛 Logs e Debug

O backend mostra logs detalhados:

```
[API] GET /api/games - Buscando todos os jogos
[Cache] Miss: all_games
[Roblox] Buscando todos os jogos: 3 jogos
[Roblox] Processando jogo completo para Place ID: 113494949872227
[Cache] Dados armazenados: universe:113494949872227 (expira em 60 minutos)
[Roblox] Jogo processado com sucesso: 💸 Mini City RP
[Cache] Dados armazenados: all_games (expira em 5 minutos)
```

Segunda requisição (usando cache):
```
[API] GET /api/games - Buscando todos os jogos
[Cache] Hit: all_games
```

## ⚠️ Importante

1. **Rate Limits:** A API do Roblox tem limites. O cache de 5 minutos evita problemas.

2. **Fallback:** Se você ver muitos fallbacks nos logs, pode ser:
   - Rate limit atingido
   - API do Roblox instável
   - Problemas de rede

3. **Place IDs:** Só funcionam os 3 jogos configurados. Para adicionar mais, edite [backend/src/config/games.ts](backend/src/config/games.ts).

## 🎨 Frontend Atualizado

O hook `useGames` agora:
- Busca dados da API automaticamente ao carregar
- Mostra loading enquanto carrega
- Trata erros graciosamente
- Usa dados mockados como fallback
- Mantém toda a funcionalidade existente (filtros, ordenação, etc.)

## 🔐 Segurança

- CORS habilitado apenas para localhost
- Nenhuma API key necessária (APIs públicas do Roblox)
- Sem autenticação (APIs públicas)
- Rate limiting via cache

## 📚 Documentação Completa

Veja [backend/README.md](backend/README.md) para documentação detalhada da API.

## ✅ Testes Realizados

- ✅ GET /api/health - Funcionando
- ✅ GET /api/games - Retorna 3 jogos com dados reais
- ✅ GET /api/games/:placeId - Retorna jogo específico
- ✅ Cache funcionando (Hit após primeira requisição)
- ✅ Erro 404 para Place ID inexistente
- ✅ Fallback funcionando quando necessário
- ✅ CORS habilitado corretamente
- ✅ Logs detalhados

## 🎉 Resultado Final

Agora você tem:
- ✅ API backend completa e funcional
- ✅ Dados reais do Roblox sendo exibidos
- ✅ Cache para evitar rate limits
- ✅ Fallback automático
- ✅ Frontend integrado
- ✅ Documentação completa
- ✅ Pronto para uso em produção

## 🚀 Próximos Passos (Opcionais)

- Deploy do backend (Render, Railway, etc.)
- Adicionar mais jogos
- WebSocket para dados em tempo real
- Dashboard de estatísticas
- Testes automatizados

---

**Desenvolvido por:** Mini Groups Studio
**Stack:** Node.js + Express + TypeScript + React + Vite

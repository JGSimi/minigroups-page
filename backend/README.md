# Mini Groups API

API backend para buscar dados reais dos jogos do Roblox da Mini Groups Studio.

## 🎮 Jogos Suportados

1. **Mini City RP** (Place ID: 113494949872227)
2. **Make A BrainRot** (Place ID: 128160564290614)
3. **Mini Shooters** (Place ID: 124863958602381)

## 🚀 Instalação e Uso

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

### Instalação

```bash
cd backend
npm install
```

### Executar em Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3001`

### Build para Produção

```bash
npm run build
npm start
```

## 📡 Endpoints da API

### GET /api/games

Retorna todos os jogos com dados reais do Roblox.

**Resposta de Sucesso:**

```json
{
  "success": true,
  "data": [
    {
      "id": "113494949872227",
      "title": "Mini City RP",
      "description": "💼 Trabalhe de Gari, Fazendeiro...",
      "thumbnail": "https://...",
      "category": "RP",
      "playersOnline": 450000,
      "visits": 3200000000,
      "rating": 4.8,
      "isPopular": true,
      "createdAt": "2025-05-11T00:00:00Z",
      "lastUpdated": "2025-10-13T00:00:00Z",
      "tags": ["roleplay", "social", "city", "jobs", "economy"],
      "developer": "Mini Groups Studio",
      "featured": true,
      "url": "https://www.roblox.com/games/113494949872227"
    }
  ]
}
```

### GET /api/games/:placeId

Retorna um jogo específico pelo Place ID.

**Parâmetros:**
- `placeId` (string): ID do Place no Roblox

**Exemplo:**
```
GET /api/games/113494949872227
```

**Resposta de Sucesso:**

```json
{
  "success": true,
  "data": {
    "id": "113494949872227",
    "title": "Mini City RP",
    "description": "💼 Trabalhe de Gari, Fazendeiro...",
    ...
  }
}
```

**Resposta de Erro:**

```json
{
  "success": false,
  "error": "Jogo com Place ID 999 não encontrado"
}
```

### GET /api/health

Health check do servidor.

**Resposta:**

```json
{
  "success": true,
  "status": "online",
  "timestamp": "2025-10-13T12:00:00.000Z",
  "service": "minigroups-api",
  "version": "1.0.0"
}
```

## 🗺️ Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── games.ts          # Configuração dos jogos
│   ├── routes/
│   │   └── games.ts          # Rotas da API
│   ├── services/
│   │   ├── cache.service.ts  # Sistema de cache
│   │   └── roblox.service.ts # Integração com Roblox API
│   ├── types/
│   │   └── index.ts          # Tipos TypeScript
│   └── index.ts              # Servidor principal
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Funcionalidades

### Cache Inteligente

- Cache automático de 5 minutos para evitar rate limits
- Cache separado por tipo de dado (universeId, games, votes, thumbnails)
- Logs detalhados de cache hits/misses

### APIs do Roblox Utilizadas

1. **Universe ID Conversion**
   - `https://apis.roblox.com/universes/v1/places/{placeId}/universe`
   - Converte Place ID para Universe ID

2. **Game Details**
   - `https://games.roblox.com/v1/games?universeIds={universeId}`
   - Busca informações do jogo (nome, descrição, jogadores, visitas)

3. **Game Votes**
   - `https://games.roblox.com/v1/games/votes?universeIds={universeId}`
   - Busca likes e dislikes

4. **Game Thumbnails**
   - `https://thumbnails.roblox.com/v1/games/icons?universeIds={universeId}&size=512x512&format=Png`
   - Busca imagem do jogo

### Sistema de Fallback

Se a API do Roblox falhar ou estiver indisponível:
- Retorna dados de fallback pré-configurados
- Garante que o site nunca fique sem dados
- Logs claros sobre uso de fallback

### Cálculo de Rating

```typescript
rating = (upVotes / (upVotes + downVotes)) * 5
```

### Categorização Automática

- **Mini City RP** → RP
- **Make A BrainRot** → Casual
- **Mini Shooters** → Action

### Tags Personalizadas

- **Mini City RP**: roleplay, social, city, jobs, economy
- **Make A BrainRot**: meme, casual, fun, creative, brainrot
- **Mini Shooters**: shooter, fps, action, combat, competitive

## 🔐 CORS

O servidor aceita requisições de:
- `http://localhost:5173` (Vite dev server padrão)
- `http://localhost:5174`
- `http://localhost:3000`

Para adicionar mais origens, edite o arquivo [src/index.ts](src/index.ts):

```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'http://seu-dominio.com'],
  credentials: true
}));
```

## 📊 Logs

O servidor fornece logs detalhados:

```
[API] GET /api/games - Buscando todos os jogos
[Roblox] Processando jogo completo para Place ID: 113494949872227
[Roblox] Buscando Universe ID para Place ID: 113494949872227
[Cache] Dados armazenados: universe:113494949872227 (expira em 60 minutos)
[Roblox] Buscando detalhes do jogo para Universe ID: 123456789
[Cache] Hit: game:123456789
[Roblox] Jogo processado com sucesso: Mini City RP
```

## 🐛 Tratamento de Erros

### Erro de Rede

Se a API do Roblox estiver indisponível, o servidor automaticamente retorna dados de fallback.

### Game Não Encontrado

```json
{
  "success": false,
  "error": "Jogo com Place ID 999 não encontrado"
}
```

### Erro Interno

```json
{
  "success": false,
  "error": "Erro ao buscar dados dos jogos. Tente novamente mais tarde."
}
```

## 🔄 Integração com Frontend

No frontend, configure a variável de ambiente:

```env
VITE_API_URL=http://localhost:3001
```

Exemplo de uso com fetch:

```typescript
const response = await fetch(`${API_URL}/api/games`);
const data = await response.json();

if (data.success) {
  console.log('Jogos:', data.data);
}
```

## 📝 Scripts do package.json

- `npm run dev` - Inicia servidor em modo desenvolvimento com hot reload
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Executa versão compilada (produção)
- `npm run type-check` - Verifica tipos TypeScript sem compilar

## 🚦 Rate Limits

A API pública do Roblox tem rate limits. O cache de 5 minutos minimiza chamadas e evita problemas.

### Recomendações:

- Não faça requisições muito frequentes
- O cache já está otimizado
- Use o sistema de fallback em caso de rate limit

## 🌐 Variáveis de Ambiente

### Backend

```env
PORT=3001                    # Porta do servidor (padrão: 3001)
NODE_ENV=development         # Ambiente (development/production)
```

### Frontend

```env
VITE_API_URL=http://localhost:3001
```

## 🆘 Troubleshooting

### Erro: "Cannot find module"

```bash
cd backend
rm -rf node_modules dist
npm install
npm run build
```

### Porta 3001 já em uso

Mate o processo ou use outra porta:

```bash
lsof -ti:3001 | xargs kill
```

Ou edite a porta no [src/index.ts](src/index.ts):

```typescript
const PORT = process.env.PORT || 3002;
```

### CORS Error no Frontend

Verifique se o frontend está usando uma origem permitida. Adicione a origem no [src/index.ts](src/index.ts).

### API do Roblox não responde

O servidor automaticamente usa dados de fallback. Verifique os logs para confirmar.

## 📦 Dependências

### Produção

- `express` - Framework web
- `cors` - Middleware CORS
- `axios` - Cliente HTTP

### Desenvolvimento

- `typescript` - Linguagem
- `tsx` - Executor TypeScript
- `@types/*` - Tipos TypeScript

## 🎯 Próximos Passos

- [ ] Adicionar autenticação (se necessário)
- [ ] Implementar WebSocket para dados em tempo real
- [ ] Adicionar mais jogos
- [ ] Criar dashboard de estatísticas
- [ ] Adicionar testes unitários
- [ ] Implementar persistência de cache (Redis)

## 📄 Licença

MIT

## 👨‍💻 Autor

Mini Groups Studio

---

**Dúvidas?** Abra uma issue no repositório.

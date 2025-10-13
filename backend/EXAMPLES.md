# 📚 Exemplos de Uso - Mini Groups API

## Exemplos com cURL

### 1. Health Check

```bash
curl http://localhost:3001/api/health
```

**Resposta:**
```json
{
  "success": true,
  "status": "online",
  "timestamp": "2025-10-13T19:19:27.876Z",
  "service": "minigroups-api",
  "version": "1.0.0"
}
```

---

### 2. Buscar Todos os Jogos

```bash
curl http://localhost:3001/api/games | python3 -m json.tool
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "113494949872227",
      "title": "💸 Mini City RP",
      "description": "🏡 Mini City RP é um jogo de roleplay...",
      "thumbnail": "https://tr.rbxcdn.com/...",
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

---

### 3. Buscar Jogo Específico

```bash
curl http://localhost:3001/api/games/113494949872227
```

---

### 4. Teste de Erro (Place ID Inexistente)

```bash
curl http://localhost:3001/api/games/999999
```

**Resposta:**
```json
{
  "success": false,
  "error": "Jogo com Place ID 999999 não encontrado"
}
```

---

## Exemplos com JavaScript/TypeScript

### Fetch API (Vanilla JS)

```javascript
// Buscar todos os jogos
async function fetchGames() {
  try {
    const response = await fetch('http://localhost:3001/api/games');
    const data = await response.json();

    if (data.success) {
      console.log('Jogos:', data.data);
      return data.data;
    } else {
      console.error('Erro:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    return [];
  }
}

fetchGames();
```

---

### React Hook (Como está implementado)

```typescript
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001';

export const useGames = () => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/api/games`);
        const data = await response.json();

        if (data.success && data.data) {
          setGames(data.data);
        } else {
          throw new Error(data.error || 'Erro ao buscar jogos');
        }
      } catch (err) {
        console.error('Erro:', err);
        setError(err.message);
        // Fallback para dados mockados
        setGames(mockGames);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  return { games, isLoading, error };
};
```

---

### Axios

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Buscar todos os jogos
async function getGames() {
  try {
    const response = await axios.get(`${API_URL}/api/games`);
    return response.data.data;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

// Buscar jogo específico
async function getGame(placeId) {
  try {
    const response = await axios.get(`${API_URL}/api/games/${placeId}`);
    return response.data.data;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
}

// Uso
const games = await getGames();
const miniCityRP = await getGame('113494949872227');
```

---

## Exemplos com React Components

### Loading State

```tsx
import { useGames } from '@/hooks/useGames';

function GamesList() {
  const { games, isLoading, error } = useGames();

  if (isLoading) {
    return <div>Carregando jogos...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>
      {games.map(game => (
        <div key={game.id}>
          <h2>{game.title}</h2>
          <p>{game.playersOnline} jogadores online</p>
          <p>Rating: {game.rating}/5</p>
        </div>
      ))}
    </div>
  );
}
```

---

### Atualizar Dados Periodicamente

```typescript
import { useState, useEffect } from 'react';

function useRealtimeGames(intervalMs = 60000) { // 1 minuto
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const response = await fetch('http://localhost:3001/api/games');
      const data = await response.json();
      if (data.success) setGames(data.data);
    };

    fetchGames(); // Busca inicial
    const interval = setInterval(fetchGames, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return games;
}

// Uso
function Dashboard() {
  const games = useRealtimeGames(60000); // Atualiza a cada 1 minuto

  return <div>{/* Renderizar jogos */}</div>;
}
```

---

## Exemplos Backend (Adicionar Funcionalidades)

### Adicionar Novo Endpoint

```typescript
// backend/src/routes/games.ts

// Endpoint para estatísticas gerais
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const games = await robloxService.getAllGames(GAME_PLACE_IDS);

    const stats = {
      totalGames: games.length,
      totalPlayers: games.reduce((sum, g) => sum + g.playersOnline, 0),
      totalVisits: games.reduce((sum, g) => sum + g.visits, 0),
      avgRating: games.reduce((sum, g) => sum + g.rating, 0) / games.length,
      popularGames: games.filter(g => g.isPopular).length
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao calcular estatísticas' });
  }
});
```

---

### Middleware de Log Personalizado

```typescript
// backend/src/index.ts

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
});
```

---

## Exemplos de Testes

### Teste Manual com Script

```javascript
// test.js
const axios = require('axios');

const API_URL = 'http://localhost:3001';

async function runTests() {
  console.log('🧪 Iniciando testes...\n');

  // Teste 1: Health Check
  console.log('1. Testando /api/health...');
  const health = await axios.get(`${API_URL}/api/health`);
  console.log('✅ Status:', health.data.status);

  // Teste 2: Buscar todos os jogos
  console.log('\n2. Testando /api/games...');
  const games = await axios.get(`${API_URL}/api/games`);
  console.log('✅ Jogos encontrados:', games.data.data.length);

  // Teste 3: Buscar jogo específico
  console.log('\n3. Testando /api/games/113494949872227...');
  const game = await axios.get(`${API_URL}/api/games/113494949872227`);
  console.log('✅ Jogo:', game.data.data.title);

  // Teste 4: Erro 404
  console.log('\n4. Testando erro 404...');
  try {
    await axios.get(`${API_URL}/api/games/999999`);
  } catch (error) {
    console.log('✅ Erro capturado:', error.response.data.error);
  }

  console.log('\n✅ Todos os testes passaram!');
}

runTests();
```

---

## Monitoramento de Cache

### Ver Estatísticas do Cache

```typescript
// Adicione este endpoint em backend/src/routes/games.ts

import { cacheService } from '../services/cache.service.js';

router.get('/cache/stats', (req: Request, res: Response) => {
  const stats = cacheService.getStats();
  res.json({
    success: true,
    data: stats
  });
});

// Limpar cache manualmente
router.delete('/cache', (req: Request, res: Response) => {
  cacheService.clear();
  res.json({
    success: true,
    message: 'Cache limpo com sucesso'
  });
});
```

---

## Integração com React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/games`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 60 * 1000 // Refetch a cada 1 minuto
  });
}

// Uso
function GamesList() {
  const { data: games, isLoading, error } = useGames();

  // Renderizar...
}
```

---

## Deploy (Exemplo com Railway)

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Criar projeto
cd backend
railway init

# 4. Deploy
railway up

# 5. Obter URL
railway domain
```

---

## Variáveis de Ambiente (Produção)

```env
# Backend (.env)
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://seu-site.com

# Frontend (.env.production)
VITE_API_URL=https://sua-api.railway.app
```

---

## Dicas de Performance

1. **Use o cache:** Já está implementado, evita rate limits
2. **Fallback:** Sempre tenha dados de fallback
3. **Timeout:** Configurado para 10s nas chamadas
4. **Parallel requests:** O código já faz chamadas paralelas
5. **Error handling:** Sempre trate erros graciosamente

---

Para mais informações, consulte o [README.md](README.md) completo.

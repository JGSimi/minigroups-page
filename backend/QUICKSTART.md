# 🚀 Quick Start - Mini Groups API

## Instalação Rápida

```bash
# 1. Instalar dependências
cd backend
npm install

# 2. Iniciar servidor
npm run dev
```

## Verificar se está funcionando

```bash
# Health check
curl http://localhost:3001/api/health

# Buscar jogos
curl http://localhost:3001/api/games
```

## Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/games` | Lista todos os jogos |
| GET | `/api/games/:placeId` | Busca jogo específico |

## Exemplo de Uso no Frontend

```typescript
const response = await fetch('http://localhost:3001/api/games');
const data = await response.json();

if (data.success) {
  console.log('Jogos:', data.data);
}
```

## Comandos Úteis

```bash
npm run dev          # Desenvolvimento (hot reload)
npm run build        # Build para produção
npm start            # Rodar versão compilada
npm run type-check   # Verificar tipos
```

## Configuração

O servidor roda na porta **3001** por padrão.

Para mudar, edite `src/index.ts`:
```typescript
const PORT = process.env.PORT || 3002;
```

## Adicionar Novos Jogos

Edite `src/config/games.ts`:

```typescript
export const GAMES_CONFIG: Record<string, GameConfig> = {
  'SEU_PLACE_ID': {
    placeId: 'SEU_PLACE_ID',
    category: 'Action', // ou 'RP' ou 'Casual'
    tags: ['tag1', 'tag2', 'tag3']
  }
};
```

## Logs

O servidor mostra logs detalhados:
- Requisições recebidas
- Cache hits/misses
- Chamadas à API do Roblox
- Erros e fallbacks

## Troubleshooting

### Porta 3001 em uso
```bash
lsof -ti:3001 | xargs kill
```

### Reinstalar dependências
```bash
rm -rf node_modules dist
npm install
npm run build
```

### CORS error
Adicione sua origem em `src/index.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'SEU_DOMINIO_AQUI']
}));
```

## Documentação Completa

Veja [README.md](README.md) para documentação detalhada.

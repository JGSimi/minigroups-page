import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import gamesRouter from './routes/games.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://minigroups.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log('[CORS] Origens permitidas:', allowedOrigins);
console.log('[CORS] NODE_ENV:', process.env.NODE_ENV);

app.use(cors({
  origin: (origin, callback) => {
    console.log('[CORS] Requisição de origem:', origin);

    // Permite requisições sem origin (como ferramentas de teste, Postman, curl)
    if (!origin) {
      console.log('[CORS] Sem origin - permitindo');
      return callback(null, true);
    }

    // Em desenvolvimento, permite qualquer origem
    if (process.env.NODE_ENV !== 'production') {
      console.log('[CORS] Modo desenvolvimento - permitindo todas as origens');
      return callback(null, true);
    }

    // Permite qualquer domínio .vercel.app em produção (fallback)
    if (origin.includes('.vercel.app')) {
      console.log('[CORS] Domínio Vercel detectado - permitindo');
      return callback(null, true);
    }

    // Em produção, verifica se a origem está na lista permitida
    if (allowedOrigins.includes(origin)) {
      console.log('[CORS] Origem na lista permitida - permitindo');
      callback(null, true);
    } else {
      console.log('[CORS] Origem não permitida:', origin);
      console.log('[CORS] Lista de origens permitidas:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/api', gamesRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Mini Groups API - Backend dos Jogos do Roblox',
    version: '1.0.0',
    endpoints: {
      games: '/api/games',
      gameById: '/api/games/:placeId',
      health: '/api/health'
    }
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Erro]', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Mini Groups API - Servidor Rodando  ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Servidor iniciado na porta ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Endpoints disponíveis:');
  console.log(`   GET  http://localhost:${PORT}/api/games`);
  console.log(`   GET  http://localhost:${PORT}/api/games/:placeId`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('⏰ Cache configurado para 5 minutos');
  console.log('🎮 Jogos configurados: 3');
  console.log('');
  console.log('Pressione Ctrl+C para parar o servidor');
  console.log('════════════════════════════════════════');
});

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import gamesRouter from './routes/games.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: true,
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

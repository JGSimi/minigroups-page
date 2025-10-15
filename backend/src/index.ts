import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gamesRouter from './routes/games.js';
import contactRouter from './routes/contact.js';

// Importa configurações e middlewares de segurança
import { corsOptions } from './config/cors.js';
import { generalLimiter, apiLimiter } from './middleware/rateLimiter.js';
import {
  helmetConfig,
  validateContentType,
  requestTimeout,
  sanitizeHeaders,
  validateOrigin,
  detectAttackPatterns,
  limitPayloadSize
} from './middleware/security.js';
import { logger, requestLogger } from './utils/logger.js';
import { sanitizeInput } from './middleware/validators.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// ============================================
// MIDDLEWARES DE SEGURANÇA (ordem importa!)
// ============================================

// 1. Helmet - Headers de segurança
app.use(helmetConfig);

// 2. CORS configurado com segurança
app.use(cors(corsOptions));

// 3. Rate limiting geral
app.use(generalLimiter);

// 4. Limite de tamanho de payload
app.use(limitPayloadSize(100000)); // 100KB

// 5. Parse JSON com limite de tamanho
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 6. Timeout de requisições (30 segundos)
app.use(requestTimeout(30000));

// 7. Sanitização de headers
app.use(sanitizeHeaders);

// 8. Validação de origem
app.use(validateOrigin);

// 9. Detecção de padrões de ataque
app.use(detectAttackPatterns);

// 10. Sanitização de inputs
app.use(sanitizeInput);

// 11. Validação de Content-Type
app.use(validateContentType);

// 12. Logging de requisições
app.use(requestLogger);

// ============================================
// ROTAS DA API
// ============================================

// Rate limiting mais restritivo para endpoints de API
app.use('/api/games', apiLimiter, gamesRouter);
app.use('/api/contact', contactRouter); // Rate limiting próprio definido na rota

// ============================================
// ROTAS PÚBLICAS
// ============================================

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Mini Groups API - Backend dos Jogos do Roblox',
    version: '2.0.0',
    security: 'Protected API',
    endpoints: {
      games: '/api/games',
      gameById: '/api/games/:placeId',
      contact: '/api/contact',
      contactHealth: '/api/contact/health',
      health: '/api/health'
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: isProduction ? 'production' : 'development'
  });
});

// ============================================
// TRATAMENTO DE ERROS
// ============================================

// Handler para erros CORS
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    logger.security('CORS violation', req, { origin: req.headers.origin });
    return res.status(403).json({
      success: false,
      error: 'Origem não permitida por política CORS'
    });
  }
  next(err);
});

// Handler global de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Erro não tratado', err);

  // Em produção, não expõe detalhes do erro
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: isProduction ? undefined : err.message,
    stack: isProduction ? undefined : err.stack
  });
});

// Handler 404 - Rota não encontrada
app.use((req: Request, res: Response) => {
  logger.warn(`Rota não encontrada: ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado',
    path: req.path
  });
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info('╔════════════════════════════════════════╗');
    logger.info('║   Mini Groups API - Servidor Rodando  ║');
    logger.info('╚════════════════════════════════════════╝');
    logger.info('');
    logger.info(`🚀 Servidor iniciado na porta ${PORT}`);
    logger.info(`📍 URL: http://localhost:${PORT}`);
    logger.info(`🔒 Modo: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
    logger.info('');
    logger.info('📋 Endpoints disponíveis:');
    logger.info(`   GET  /api/games`);
    logger.info(`   GET  /api/games/:placeId`);
    logger.info(`   POST /api/contact`);
    logger.info(`   GET  /api/contact/health`);
    logger.info(`   GET  /api/health`);
    logger.info('');
    logger.info('🛡️  Segurança:');
    logger.info('   ✓ Helmet (Headers seguros)');
    logger.info('   ✓ Rate Limiting (100 req/15min)');
    logger.info('   ✓ CORS Restritivo');
    logger.info('   ✓ Input Validation & Sanitization');
    logger.info('   ✓ Attack Pattern Detection');
    logger.info('   ✓ Request Timeout (30s)');
    logger.info('   ✓ Payload Size Limit (100KB)');
    logger.info('');
    logger.info('Pressione Ctrl+C para parar o servidor');
    logger.info('════════════════════════════════════════');
  });
}

// Exporta o app para Vercel Serverless Functions
export default app;

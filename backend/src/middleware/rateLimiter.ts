import rateLimit from 'express-rate-limit';

// Rate limiter geral para todos os endpoints
// Configurado para funcionar em ambiente serverless (Vercel)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por windowMs
  message: {
    success: false,
    error: 'Muitas requisições deste IP. Por favor, tente novamente mais tarde.',
    retryAfter: '15 minutos'
  },
  standardHeaders: 'draft-7', // Usa draft-7 standard headers para melhor compatibilidade
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
  // Skip rate limiting para requisições OPTIONS (CORS preflight)
  skip: (req) => req.method === 'OPTIONS',
  // Armazena contadores de IP
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Muitas requisições. Por favor, aguarde antes de tentar novamente.',
      retryAfter: 900
    });
  }
});

// Rate limiter mais restritivo para endpoints de API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 60, // Limite de 60 requisições por windowMs para API
  message: {
    success: false,
    error: 'Limite de requisições à API excedido. Tente novamente mais tarde.',
    retryAfter: '15 minutos'
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => {
    // Skip OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') return true;
    // Pula rate limiting para requisições com API key válida (se implementado)
    return !!req.headers['x-api-key'] && req.headers['x-api-key'] === process.env.API_KEY;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Limite de requisições à API excedido.',
      retryAfter: 900
    });
  }
});

// Rate limiter extremamente restritivo para proteção contra DDoS
export const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // Apenas 10 requisições por minuto
  message: {
    success: false,
    error: 'Muitas requisições. Acesso temporariamente bloqueado.',
    retryAfter: '1 minuto'
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS', // Skip CORS preflight
  skipSuccessfulRequests: false, // Conta todas as requisições, incluindo bem-sucedidas
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Acesso temporariamente bloqueado devido a excesso de requisições.',
      retryAfter: 60
    });
  }
});

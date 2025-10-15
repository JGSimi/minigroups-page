import { CorsOptions } from 'cors';

const isProduction = process.env.NODE_ENV === 'production';

// Lista de origens permitidas
const allowedOrigins = [
  // Ambientes de desenvolvimento
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:4173',
  // Frontend em produção
  'https://minigroups.vercel.app',
  // Permite URL customizada via variável de ambiente
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

console.log('[CORS Config] Origens permitidas:', allowedOrigins);
console.log('[CORS Config] Ambiente:', isProduction ? 'production' : 'development');

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Log da origem da requisição (apenas em desenvolvimento)
    if (!isProduction && origin) {
      console.log('[CORS] Requisição de:', origin);
    }

    // Permite requisições sem origin (ferramentas como Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Em desenvolvimento, permite qualquer origem localhost
    if (!isProduction && origin.includes('localhost')) {
      return callback(null, true);
    }

    // Em produção, valida contra lista de origens permitidas
    if (isProduction) {
      // Permite apenas origens específicas na lista
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`[CORS] Origem bloqueada: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Em desenvolvimento, permite tudo
      return callback(null, true);
    }
  },

  // Permite envio de cookies e credenciais
  credentials: true,

  // Métodos HTTP permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],

  // Headers permitidos
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key'
  ],

  // Headers expostos para o cliente
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'RateLimit-Limit',
    'RateLimit-Remaining',
    'RateLimit-Reset'
  ],

  // Tempo de cache da resposta preflight (OPTIONS)
  maxAge: 86400, // 24 horas

  // Status code para requisições bem-sucedidas
  optionsSuccessStatus: 204
};

// Função helper para validar se uma origem é permitida
export const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true;

  if (!isProduction && origin.includes('localhost')) {
    return true;
  }

  return allowedOrigins.includes(origin);
};

// Exporta lista de origens para uso em outros lugares
export { allowedOrigins };

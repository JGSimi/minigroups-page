import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware para lidar com erros de validação
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Erro de validação',
      details: errors.array().map(err => ({
        field: 'path' in err ? err.path : 'unknown',
        message: err.msg,
        value: 'value' in err ? err.value : undefined
      }))
    });
  }

  next();
};

// Validadores para o endpoint de buscar jogo por ID
export const validateGameId = [
  param('placeId')
    .isNumeric()
    .withMessage('Place ID deve ser um número')
    .isInt({ min: 1, max: 9999999999 })
    .withMessage('Place ID inválido')
    .toInt(),
  handleValidationErrors
];

// Validadores para query parameters de busca
export const validateGameQuery = [
  query('search')
    .optional()
    .isString()
    .withMessage('Parâmetro search deve ser uma string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Busca deve ter entre 1 e 100 caracteres')
    .escape(), // Sanitiza para prevenir XSS

  query('category')
    .optional()
    .isString()
    .withMessage('Categoria deve ser uma string')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Categoria deve ter no máximo 50 caracteres')
    .escape(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser entre 1 e 100')
    .toInt(),

  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset deve ser maior ou igual a 0')
    .toInt(),

  handleValidationErrors
];

// Validador genérico para IDs numéricos
export const validateNumericId = (fieldName: string = 'id') => [
  param(fieldName)
    .isNumeric()
    .withMessage(`${fieldName} deve ser um número`)
    .isInt({ min: 1 })
    .withMessage(`${fieldName} deve ser um inteiro positivo`)
    .toInt(),
  handleValidationErrors
];

// Validador para prevenir SQL Injection e XSS em qualquer campo
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const dangerousPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/gi,           // SQL Injection
    /(<script[^>]*>.*?<\/script>)/gi,            // XSS Script tags
    /javascript:/gi,                              // JavaScript protocol
    /on\w+\s*=/gi,                               // Event handlers
    /(union.*select|select.*from|insert.*into|delete.*from|drop.*table)/gi // SQL commands
  ];

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      for (const pattern of dangerousPatterns) {
        if (pattern.test(obj)) {
          throw new Error('Entrada contém caracteres ou padrões não permitidos');
        }
      }
      return obj.trim();
    }

    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeObject(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }

    return obj;
  };

  try {
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Entrada inválida detectada'
    });
  }
};

// Validador para API Key (se implementado)
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  const validApiKey = process.env.API_KEY;

  // Se não houver API_KEY configurada, pula validação
  if (!validApiKey) {
    return next();
  }

  // Se houver API_KEY configurada, valida
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      error: 'API Key inválida ou ausente'
    });
  }

  next();
};

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { rateLimit } from 'express-rate-limit';
import { EmailService } from '../services/email.service.js';
import { logger } from '../utils/logger.js';
import type { ContactFormRequest, ApiResponse } from '../types/index.js';

const router = Router();

// Rate limiting específico para contato (mais restritivo)
// 5 requisições por 15 minutos para prevenir spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limite de 5 tentativas
  message: {
    success: false,
    error: 'Muitas tentativas de contato. Por favor, tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Identifica por IP
  keyGenerator: (req) => {
    return req.ip || 'unknown';
  },
});

// Validações do formulário de contato
const contactValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Nome contém caracteres inválidos'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email muito longo'),

  body('gameLink')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true; // Campo opcional

      // Valida se é uma URL do Roblox
      const robloxUrlPattern = /^https?:\/\/(www\.)?roblox\.com\/(games|discover)\/\d+/i;

      if (!robloxUrlPattern.test(value)) {
        throw new Error('Link deve ser uma URL válida do Roblox');
      }

      return true;
    })
    .isLength({ max: 500 })
    .withMessage('Link muito longo'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Mensagem é obrigatória')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Mensagem deve ter entre 10 e 2000 caracteres')
    .custom((value) => {
      // Previne conteúdo malicioso básico
      const suspiciousPatterns = /<script|javascript:|onerror=|onclick=/i;
      if (suspiciousPatterns.test(value)) {
        throw new Error('Mensagem contém conteúdo não permitido');
      }
      return true;
    }),

  body('ageConfirm')
    .isBoolean()
    .withMessage('Confirmação de idade deve ser verdadeira ou falsa')
    .equals('true')
    .withMessage('Você deve confirmar que tem mais de 13 anos'),
];

/**
 * POST /api/contact
 * Envia um formulário de contato por email
 */
router.post(
  '/',
  contactLimiter,
  contactValidationRules,
  async (req: Request<{}, {}, ContactFormRequest>, res: Response<ApiResponse<{ message: string }>>) => {
    try {
      // Verifica se há erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Validação de formulário de contato falhou', {
          ip: req.ip,
          errors: errors.array(),
        });

        return res.status(400).json({
          success: false,
          error: errors.array()[0].msg, // Retorna o primeiro erro
        });
      }

      // Verifica se o serviço de email está configurado
      if (!EmailService.isConfigured()) {
        logger.error('Serviço de email não configurado - RESEND_API_KEY ausente');
        return res.status(503).json({
          success: false,
          error: 'Serviço de email temporariamente indisponível. Tente novamente mais tarde.',
        });
      }

      const formData = req.body;

      // Verifica confirmação de idade
      if (!formData.ageConfirm) {
        return res.status(400).json({
          success: false,
          error: 'Você deve confirmar que tem mais de 13 anos',
        });
      }

      // Log da tentativa de envio
      logger.info('Processando formulário de contato', {
        ip: req.ip,
        name: formData.name,
        email: formData.email,
        hasGameLink: !!formData.gameLink,
      });

      // Envia o email
      const result = await EmailService.sendContactEmail(formData);

      if (!result.success) {
        logger.error('Falha ao enviar email de contato', {
          error: result.error,
          email: formData.email,
        });

        return res.status(500).json({
          success: false,
          error: 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.',
        });
      }

      // Sucesso
      logger.info('Email de contato enviado com sucesso', {
        name: formData.name,
        email: formData.email,
      });

      return res.status(200).json({
        success: true,
        data: {
          message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        },
      });
    } catch (error) {
      logger.error('Erro inesperado ao processar formulário de contato', error);

      return res.status(500).json({
        success: false,
        error: 'Erro interno ao processar sua solicitação',
      });
    }
  }
);

/**
 * GET /api/contact/health
 * Verifica se o serviço de email está configurado
 */
router.get('/health', (req: Request, res: Response) => {
  const isConfigured = EmailService.isConfigured();

  res.json({
    success: true,
    data: {
      configured: isConfigured,
      status: isConfigured ? 'ready' : 'not_configured',
    },
  });
});

export default router;

import { Request, Response, NextFunction } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

// Tipos de log
type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'security';

// Interface para structured logging
interface LogData {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  ip?: string;
  method?: string;
  path?: string;
  userAgent?: string;
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // Em produção, não loga debug
    if (isProduction && level === 'debug') {
      return false;
    }
    return true;
  }

  private formatLog(logData: LogData): string {
    if (isProduction) {
      // Em produção, usa formato JSON estruturado
      return JSON.stringify(logData);
    } else {
      // Em desenvolvimento, formato mais legível
      const emoji = {
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
        debug: '🔍',
        security: '🔒'
      };
      return `${emoji[logData.level]} [${logData.level.toUpperCase()}] ${logData.message}${logData.data ? '\n' + JSON.stringify(logData.data, null, 2) : ''}`;
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      const logData: LogData = {
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        data
      };
      console.log(this.formatLog(logData));
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      const logData: LogData = {
        level: 'warn',
        message,
        timestamp: new Date().toISOString(),
        data
      };
      console.warn(this.formatLog(logData));
    }
  }

  error(message: string, error?: Error | any) {
    if (this.shouldLog('error')) {
      const logData: LogData = {
        level: 'error',
        message,
        timestamp: new Date().toISOString(),
        data: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: isProduction ? undefined : error.stack
        } : error
      };
      console.error(this.formatLog(logData));
    }
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      const logData: LogData = {
        level: 'debug',
        message,
        timestamp: new Date().toISOString(),
        data
      };
      console.log(this.formatLog(logData));
    }
  }

  security(message: string, req?: Request, data?: any) {
    if (this.shouldLog('security')) {
      const logData: LogData = {
        level: 'security',
        message,
        timestamp: new Date().toISOString(),
        data,
        ip: req?.ip || req?.socket?.remoteAddress,
        method: req?.method,
        path: req?.path,
        userAgent: req?.headers['user-agent']
      };
      console.warn(this.formatLog(logData));
    }
  }

  request(req: Request) {
    // Em produção, loga apenas informações essenciais
    if (isProduction) {
      const logData: LogData = {
        level: 'info',
        message: 'HTTP Request',
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        ip: req.ip || req.socket?.remoteAddress
      };
      console.log(this.formatLog(logData));
    } else {
      // Em desenvolvimento, loga mais informações
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip || req.socket?.remoteAddress}`);
    }
  }
}

// Exporta instância única do logger
export const logger = new Logger();

// Middleware para logging de requisições
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Captura o evento de finalização da resposta
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    if (!isProduction) {
      logger.info(`${req.method} ${req.path} - ${statusCode} (${duration}ms)`);
    } else {
      // Em produção, só loga erros ou requisições lentas
      if (statusCode >= 400 || duration > 5000) {
        logger.info(`${req.method} ${req.path} - ${statusCode} (${duration}ms)`, {
          ip: req.ip,
          userAgent: req.headers['user-agent']
        });
      }
    }
  });

  next();
};

// Sanitiza dados sensíveis antes de logar
export const sanitizeForLog = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'authorization', 'cookie'];
  const sanitized = { ...data };

  for (const key in sanitized) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeForLog(sanitized[key]);
    }
  }

  return sanitized;
};

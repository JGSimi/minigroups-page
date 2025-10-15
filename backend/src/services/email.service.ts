import { Resend } from 'resend';
import { logger } from '../utils/logger.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  gameLink?: string;
  message: string;
  ageConfirm: boolean;
}

export class EmailService {
  /**
   * Envia email de contato para a empresa
   */
  static async sendContactEmail(formData: ContactFormData): Promise<{ success: boolean; error?: string }> {
    try {
      const { name, email, gameLink, message } = formData;

      // Email de destino (empresa)
      const toEmail = process.env.CONTACT_EMAIL || 'contato@minigroups.com';

      // Template do email
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
              .value { padding: 10px; background: white; border-radius: 5px; border-left: 3px solid #667eea; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎮 Novo Contato - Mini Groups</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Nome:</div>
                  <div class="value">${name}</div>
                </div>

                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value">${email}</div>
                </div>

                ${gameLink ? `
                <div class="field">
                  <div class="label">Link do Jogo:</div>
                  <div class="value"><a href="${gameLink}" target="_blank">${gameLink}</a></div>
                </div>
                ` : ''}

                <div class="field">
                  <div class="label">Mensagem:</div>
                  <div class="value">${message.replace(/\n/g, '<br>')}</div>
                </div>

                <div class="footer">
                  <p>Email recebido em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
                  <p>Mini Groups Studio - Sistema de Contato Automático</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      // Envia o email
      const result = await resend.emails.send({
        from: 'Mini Groups <contato@minigroups.com>', // Você precisará configurar seu domínio no Resend
        to: toEmail,
        replyTo: email, // Permite responder diretamente para o usuário
        subject: `🎮 Novo Contato: ${name}`,
        html: emailHtml,
      });

      logger.info('Email enviado com sucesso', {
        id: result.data?.id,
        to: toEmail,
        from: email,
      });

      return { success: true };
    } catch (error) {
      logger.error('Erro ao enviar email', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar email',
      };
    }
  }

  /**
   * Verifica se o serviço de email está configurado
   */
  static isConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
  }
}

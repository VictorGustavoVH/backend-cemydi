import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const emailHost = this.configService.get<string>('EMAIL_HOST');
    const emailPort = this.configService.get<number>('EMAIL_PORT');
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASS');

    // Verificar si las credenciales están configuradas
    if (!emailHost || !emailPort || !emailUser || !emailPass) {
      this.logger.warn('⚠️  Variables de EMAIL no configuradas en .env');
      this.logger.warn('⚠️  Los correos no se enviarán. Configura EMAIL_HOST, EMAIL_PORT, EMAIL_USER y EMAIL_PASS');
      this.logger.warn('⚠️  Para pruebas: usa Ethereal Email en https://ethereal.email/create');
      // Crear un transporter dummy que fallará pero permitirá continuar
      this.transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 587,
      });
      return;
    }

    // Configurar el transporter de nodemailer
    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465, // true para 465, false para otros puertos
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  /**
   * Envía un correo con el código OTP de recuperación de contraseña
   */
  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    // Para Brevo, el EMAIL_FROM debe ser un email válido o usar el formato correcto
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const customFrom = this.configService.get<string>('EMAIL_FROM');
    
    // Para Brevo, el EMAIL_FROM debe ser un email válido verificado
    // Si usas plan gratuito, normalmente necesitas usar el formato: "Nombre <email_verificado>"
    // O simplemente usar el email del usuario SMTP si no tienes dominio verificado
    let fromEmail: string;
    
    if (this.configService.get<string>('EMAIL_HOST')?.includes('brevo')) {
      // Para Brevo, usa el email del usuario SMTP si no hay EMAIL_FROM válido
      if (customFrom && customFrom.includes('@')) {
        // Si EMAIL_FROM tiene @, usarlo
        fromEmail = customFrom.includes('<') ? customFrom : `Ortopedia CEMYDI <${customFrom}>`;
      } else {
        // Usar el email del usuario SMTP de Brevo
        fromEmail = `Ortopedia CEMYDI <${emailUser}>`;
      }
    } else {
      // Para otros proveedores SMTP
      fromEmail = customFrom || emailUser || 'Ortopedia CEMYDI <noreply@cemydi.com>';
    }
    
    this.logger.log(`📧 Preparando envío de correo a: ${email}`);
    this.logger.log(`📧 Desde: ${fromEmail}`);
    this.logger.log(`📧 Código OTP: ${code}`);

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: 'Código de recuperación de contraseña',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .code {
              background-color: #ffffff;
              border: 2px dashed #4F46E5;
              border-radius: 5px;
              padding: 20px;
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              color: #4F46E5;
              letter-spacing: 5px;
              margin: 20px 0;
            }
            .warning {
              background-color: #FEF3C7;
              border-left: 4px solid #F59E0B;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #6B7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Recuperación de Contraseña</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Has solicitado restablecer tu contraseña. Usa el siguiente código para continuar:</p>
              
              <div class="code">${code}</div>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Este código expira en 10 minutos</li>
                  <li>No compartas este código con nadie</li>
                  <li>Si no solicitaste este código, ignora este correo</li>
                </ul>
              </div>
              
              <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas.</p>
              <p>&copy; ${new Date().getFullYear()} Ortopedia CEMYDI. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Recuperación de Contraseña - Ortopedia CEMYDI
        
        Has solicitado restablecer tu contraseña. Usa el siguiente código:
        
        ${code}
        
        Este código expira en 10 minutos.
        
        Si no solicitaste este cambio, ignora este correo.
        
        © ${new Date().getFullYear()} Ortopedia CEMYDI
      `,
    };

    try {
      // Verificar conexión antes de enviar
      await this.transporter.verify();
      this.logger.log(`✅ Conexión SMTP verificada correctamente`);
      
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Correo de recuperación enviado a ${email}`);
      this.logger.log(`   MessageId: ${info.messageId}`);
      this.logger.log(`   Código OTP: ${code}`);
      this.logger.log(`   Respuesta del servidor: ${JSON.stringify(info.response)}`);
      
      // Si usa Brevo, mostrar información adicional
      if (this.configService.get<string>('EMAIL_HOST')?.includes('brevo')) {
        this.logger.warn(`⚠️  IMPORTANTE: Verifica tu bandeja de entrada y carpeta de SPAM`);
        this.logger.warn(`⚠️  Los correos de Brevo pueden llegar a spam en la primera vez`);
        this.logger.warn(`⚠️  El código también aparece en la consola del servidor para pruebas`);
      }
    } catch (error: any) {
      this.logger.error(`❌ Error al enviar correo a ${email}:`);
      this.logger.error(`   Error: ${error.message}`);
      if (error.response) {
        this.logger.error(`   Respuesta del servidor: ${error.response}`);
      }
      throw new Error('No se pudo enviar el correo de recuperación');
    }
  }

  /**
   * Verifica la conexión con el servidor SMTP
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Conexión SMTP verificada correctamente');
      return true;
    } catch (error) {
      this.logger.error('Error al verificar conexión SMTP:', error);
      return false;
    }
  }
}


# 📧 Configuración de Email con Resend

Este proyecto utiliza **Resend** para el envío de correos electrónicos. Resend es una plataforma moderna y confiable para el envío de emails transaccionales.

## 🔑 Requisitos Previos

1. **Cuenta en Resend**: Regístrate en https://resend.com
2. **API Key**: Necesitas obtener tu API key desde el dashboard de Resend

## 📝 Configuración Paso a Paso

### 1. Crear cuenta en Resend

1. Ve a https://resend.com
2. Crea una cuenta gratuita
3. Verifica tu email de registro

### 2. Obtener API Key

1. Inicia sesión en el dashboard de Resend
2. Ve a la sección **API Keys** (o **Settings** → **API Keys**)
3. Haz clic en **Create API Key**
4. Dale un nombre descriptivo (ej: "Ortopedia CEMYDI Backend")
5. **Copia la API Key** (comienza con `re_`)

⚠️ **IMPORTANTE**: La API Key solo se muestra una vez. Guárdala en un lugar seguro.

### 3. Configurar dominio (Opcional para producción)

Para producción, es recomendable verificar tu dominio:

1. Ve a **Domains** en el dashboard
2. Haz clic en **Add Domain**
3. Sigue las instrucciones para agregar registros DNS
4. Una vez verificado, podrás usar emails con tu dominio

### 4. Configurar variables de entorno

Agrega estas variables en tu archivo `.env`:

```env
# API Key de Resend (obligatoria)
RESEND_API_KEY=re_4gCzcq6e_CKNNUpfkoWX5vv2Y8rwCRNyy

# Email remitente (obligatorio)
# Formato: "Nombre <email@dominio.com>" o solo "email@dominio.com"
# Para desarrollo/pruebas, puedes usar el dominio de prueba de Resend
EMAIL_FROM="Ortopedia CEMYDI <no-reply@cemydi.com>"
```

#### 📌 Notas importantes:

- **RESEND_API_KEY**: Tu clave API de Resend (obligatoria)
- **EMAIL_FROM**: El email que aparecerá como remitente
  - En desarrollo, puedes usar el dominio de prueba: `onboarding@resend.dev`
  - En producción, usa un dominio verificado
  - Formato recomendado: `"Nombre <email@dominio.com>"`

## 🧪 Probar la Configuración

### Opción 1: Endpoint de prueba (solo desarrollo)

En modo desarrollo, puedes usar el endpoint de prueba:

```bash
# Ejemplo con curl
curl "http://localhost:4000/email/test?to=tu-email@ejemplo.com"
```

O visita en tu navegador:
```
http://localhost:4000/email/test?to=tu-email@ejemplo.com
```

⚠️ Este endpoint solo funciona cuando `NODE_ENV !== 'production'`.

### Opción 2: Probar con recuperación de contraseña

1. Inicia el servidor:
   ```bash
   npm run start:dev
   ```

2. Envía una petición de recuperación de contraseña:
   ```bash
   curl -X POST http://localhost:4000/auth/request-password-reset \
     -H "Content-Type: application/json" \
     -d '{"email":"tu-email@ejemplo.com"}'
   ```

3. Verifica tu bandeja de entrada (y carpeta de spam)

## ✅ Verificación de Funcionamiento

Si está configurado correctamente, verás en la consola del servidor:

```
✅ ResendService inicializado correctamente
📧 Preparando envío de correo a: usuario@ejemplo.com
✅ Correo de recuperación enviado a usuario@ejemplo.com
   MessageId: abc123...
   Código OTP: 123456
```

## 🚨 Solución de Problemas

### Error: "RESEND_API_KEY no está configurada"

**Solución**: Verifica que la variable `RESEND_API_KEY` esté en tu archivo `.env` y que el servidor se haya reiniciado después de agregarla.

### Error: "Invalid API key"

**Solución**: 
- Verifica que copiaste la API Key completa (debe comenzar con `re_`)
- Asegúrate de que no hay espacios extra al inicio o final
- Obtén una nueva API Key desde el dashboard de Resend

### El correo no llega

**Posibles causas**:
1. Revisa la carpeta de **spam/no deseado**
2. Verifica que el email de destino sea válido
3. Si usas el dominio de prueba (`onboarding@resend.dev`), verifica que no haya superado el límite
4. Revisa los logs del servidor para ver si hay errores específicos

### Error en producción

Si en producción obtienes errores:
- Verifica que las variables de entorno estén configuradas en tu plataforma de despliegue (Vercel, Railway, etc.)
- Asegúrate de que `EMAIL_FROM` use un dominio verificado en Resend
- Revisa los logs del servidor para más detalles

## 📚 Recursos Adicionales

- **Documentación oficial de Resend**: https://resend.com/docs
- **Dashboard de Resend**: https://resend.com/emails
- **Límites del plan gratuito**: 3,000 correos/mes

## 🔒 Seguridad

- **NUNCA** subas tu API Key a repositorios públicos
- Agrega `.env` a tu `.gitignore`
- En producción, usa variables de entorno seguras proporcionadas por tu plataforma de hosting


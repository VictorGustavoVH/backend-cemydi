# 🔧 Configuración de Resend en Vercel

## 📋 Variables de Entorno Requeridas en Vercel

Ve a **Vercel Dashboard** → Tu proyecto backend → **Settings** → **Environment Variables** y agrega:

### ✅ Variables Obligatorias:

```env
# API Key de Resend (obligatoria)
RESEND_API_KEY=re_4gCzcq6e_CKNNUpfkoWX5vv2Y8rwCRNyy

# Email remitente
# Opción 1: Dominio de prueba (recomendado para empezar)
EMAIL_FROM="Ortopedia CEMYDI <onboarding@resend.dev>"

# Opción 2: Si tienes dominio verificado en Resend
EMAIL_FROM="Ortopedia CEMYDI <no-reply@cemydi.com>"
```

### 📌 Notas Importantes:

1. **RESEND_API_KEY**: 
   - Obtén tu API Key en: https://resend.com/api-keys
   - Debe comenzar con `re_`
   - ⚠️ **IMPORTANTE**: Agrégala como variable de entorno en Vercel, NO en el código

2. **EMAIL_FROM**:
   - Si no tienes un dominio verificado, usa: `onboarding@resend.dev`
   - Si tienes dominio verificado en Resend, puedes usar tu dominio
   - Formato recomendado: `"Nombre <email@dominio.com>"`


   ```

## 🚀 Pasos para Configurar:

### 1. Obtener API Key de Resend

1. Ve a https://resend.com
2. Inicia sesión o crea una cuenta
3. Ve a **API Keys** en el dashboard
4. Haz clic en **Create API Key**
5. Dale un nombre (ej: "Ortopedia CEMYDI - Vercel Production")
6. **Copia la API Key** (solo se muestra una vez)

### 2. Agregar Variables en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. **Settings** → **Environment Variables**
3. Agrega cada variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: `re_...` (tu API Key)
   - **Environment**: Selecciona **Production**, **Preview**, y **Development**
4. Repite para `EMAIL_FROM`
5. Haz clic en **Save**

### 3. Redesplegar

Después de agregar las variables:

1. Ve a **Deployments**
2. Encuentra el último deployment
3. Haz clic en los **3 puntos** (⋯)
4. Selecciona **Redeploy**
5. Espera a que termine el deployment

## 🧪 Verificar que Funciona:

### Opción 1: Revisar Logs de Vercel

1. Ve a **Deployments** → Último deployment
2. Haz clic en **View Function Logs**
3. Busca mensajes como:
   ```
   ✅ ResendService inicializado correctamente
   📧 Preparando envío de correo a: ...
   ✅ Correo de recuperación enviado a ...
   ```

### Opción 2: Probar Endpoint de Recuperación

Desde tu frontend o con Postman:

```bash
POST https://tu-backend.vercel.app/auth/request-password-reset
Content-Type: application/json

{
  "email": "tu-email-real@ejemplo.com"
}
```

### Opción 3: Revisar Dashboard de Resend

1. Ve a https://resend.com/emails
2. Deberías ver los correos enviados
3. Si hay errores, aparecerán aquí con detalles

## 🚨 Solución de Problemas:

### Error: "RESEND_API_KEY no está configurada"

**Causa**: La variable no está en Vercel o no se redesplegó

**Solución**:
1. Verifica que la variable esté en **Settings** → **Environment Variables**
2. Verifica que esté marcada para **Production**
3. Haz un **Redeploy** completo

### Error: "Invalid API key"

**Causa**: La API Key es incorrecta o está revocada

**Solución**:
1. Obtén una nueva API Key desde https://resend.com/api-keys
2. Actualiza la variable en Vercel
3. Redesplega

### Error: "Domain not verified" o "Invalid from address"

**Causa**: `EMAIL_FROM` usa un dominio no verificado

**Solución**:
- **Temporal**: Usa `onboarding@resend.dev` (dominio de prueba)
- **Permanente**: Verifica tu dominio en Resend:
  1. Ve a https://resend.com/domains
  2. Haz clic en **Add Domain**
  3. Sigue las instrucciones para agregar registros DNS
  4. Una vez verificado, usa tu dominio en `EMAIL_FROM`

### El correo no llega (pero no hay error en logs)

**Posibles causas**:
1. Revisa la carpeta de **spam/no deseado**
2. Verifica que el email de destino sea válido
3. Si usas `onboarding@resend.dev`, verifica límites diarios
4. Revisa el dashboard de Resend para ver si el email se envió

### Los logs no muestran nada

**Causa**: El logger en producción solo muestra errores y warnings

**Solución**:
- Los logs importantes aparecen en **View Function Logs** de Vercel
- Si hay errores, aparecerán con `❌` o `⚠️`

## 📊 Checklist de Verificación:

- [ ] `RESEND_API_KEY` agregada en Vercel Environment Variables
- [ ] `EMAIL_FROM` agregada en Vercel (usa `onboarding@resend.dev` si no tienes dominio)
- [ ] Variables marcadas para **Production**, **Preview** y **Development**
- [ ] Deployment completado después de agregar variables
- [ ] Logs en Vercel muestran "✅ ResendService inicializado correctamente"
- [ ] Prueba de envío realizada
- [ ] Correo recibido (o al menos aparece en dashboard de Resend)

## 🔗 Enlaces Útiles:

- Dashboard de Resend: https://resend.com
- API Keys: https://resend.com/api-keys
- Emails Enviados: https://resend.com/emails
- Dominios: https://resend.com/domains
- Documentación: https://resend.com/docs


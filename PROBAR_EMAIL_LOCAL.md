# 🧪 Guía para Probar Envío de Emails Localmente

## 📋 Paso 1: Verificar Variables de Entorno

Asegúrate de que tu archivo `.env` en la carpeta `backend` tenga:


```

⚠️ **Nota**: Si no tienes un dominio verificado en Resend, puedes usar el dominio de prueba:
```env
EMAIL_FROM="Ortopedia CEMYDI <onboarding@resend.dev>"
```

## 📋 Paso 2: Iniciar el Servidor

Abre una terminal en la carpeta `backend` y ejecuta:

```bash
npm run start:dev
```

Deberías ver algo como:
```
✅ ResendService inicializado correctamente
🚀 Aplicación corriendo en http://localhost:4000
```

Si ves `⚠️ RESEND_API_KEY no está configurada`, verifica que el `.env` tenga la variable correcta.

## 📋 Paso 3: Probar el Endpoint de Prueba

### Opción A: Con el navegador

Abre tu navegador y visita:
```
http://localhost:4000/email/test?to=TU-EMAIL@ejemplo.com
```

Reemplaza `TU-EMAIL@ejemplo.com` con tu email real.

### Opción B: Con curl (PowerShell/CMD)

```powershell
curl "http://localhost:4000/email/test?to=TU-EMAIL@ejemplo.com"
```

### Opción C: Con Invoke-WebRequest (PowerShell)

```powershell
Invoke-WebRequest -Uri "http://localhost:4000/email/test?to=TU-EMAIL@ejemplo.com" -UseBasicParsing
```

## 📋 Paso 4: Verificar los Logs

En la consola del servidor deberías ver:

```
📧 Preparando envío de correo a: TU-EMAIL@ejemplo.com
📧 Desde: Ortopedia CEMYDI <no-reply@cemydi.com>
✅ Correo de prueba enviado a TU-EMAIL@ejemplo.com
   MessageId: abc123...
```

## 📋 Paso 5: Probar Recuperación de Contraseña

Si el endpoint de prueba funciona, prueba el flujo completo:

```powershell
# 1. Solicitar código de recuperación
Invoke-WebRequest -Uri "http://localhost:4000/auth/request-password-reset" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"TU-EMAIL@ejemplo.com"}'
```

## 🚨 Solución de Problemas

### Error: "RESEND_API_KEY no está configurada"

- Verifica que el archivo `.env` esté en `backend/.env`
- Asegúrate de haber reiniciado el servidor después de agregar la variable
- Verifica que no haya espacios extra en la API Key

### Error: "Invalid API key"

- Verifica que la API Key esté completa (debe comenzar con `re_`)
- Obtén una nueva API Key desde https://resend.com/api-keys

### El correo no llega

1. **Revisa la carpeta de spam/no deseado**
2. **Verifica que el email sea válido**
3. **Revisa los logs del servidor** para ver si hay errores
4. **Si usas `onboarding@resend.dev`**, verifica que no hayas superado el límite diario

### El servidor no inicia

- Verifica que todas las dependencias estén instaladas: `npm install`
- Revisa que el puerto 4000 esté libre
- Verifica los logs de error en la consola


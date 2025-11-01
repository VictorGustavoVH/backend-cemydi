# 📧 Configuración de Email Gratuito para Producción

## Opción 1: Gmail (Recomendado - Gratis y Fácil)

### Pasos para configurar Gmail:

1. **Habilita la verificación en 2 pasos:**
   - Ve a tu cuenta de Google: https://myaccount.google.com/
   - Clic en "Seguridad" en el menú lateral
   - Busca "Verificación en dos pasos" y actívala

2. **Genera una Contraseña de aplicación:**
   - En la misma página de Seguridad, busca "Contraseñas de aplicaciones"
   - O ve directamente a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe: "Ortopedia CEMYDI Backend"
   - Haz clic en "Generar"
   - **Copia la contraseña de 16 caracteres** (se muestra solo una vez)

3. **Configura en tu `.env`:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop  ← La contraseña de aplicación (16 caracteres sin espacios)
   EMAIL_FROM="Ortopedia CEMYDI <tu_email@gmail.com>"
   ```

### ⚠️ IMPORTANTE:
- **NO uses tu contraseña normal de Gmail**
- **Usa SOLO la contraseña de aplicación de 16 caracteres**
- Quita los espacios si los tiene: `abcdefghijklmnop`

---

## Opción 2: Outlook/Hotmail (También Gratis)

### Pasos:

1. **Ve a tu cuenta de Microsoft:**
   - https://account.microsoft.com/
   - Clic en "Seguridad"

2. **Habilita la verificación en 2 pasos**

3. **Genera una contraseña de aplicación:**
   - Similar a Gmail
   - O ve a: https://account.microsoft.com/security/app-passwords

4. **Configura en tu `.env`:**
   ```env
   EMAIL_HOST=smtp-mail.outlook.com
   EMAIL_PORT=587
   EMAIL_USER=tu_email@outlook.com
   EMAIL_PASS=tu_contraseña_de_aplicacion
   EMAIL_FROM="Ortopedia CEMYDI <tu_email@outlook.com>"
   ```

---

## Opción 3: Brevo (Sendinblue) - Plan Gratuito Generoso

### Ventajas:
- ✅ 300 correos gratis por día
- ✅ No necesita verificación en 2 pasos
- ✅ API key simple
- ✅ Ideal para producción pequeña

### Pasos:

1. **Regístrate en Brevo:**
   - Ve a: https://www.brevo.com/
   - Crea una cuenta gratuita

2. **Obtén tu API Key:**
   - Ve a: Settings → SMTP & API → SMTP
   - O directamente: https://app.brevo.com/settings/keys/api
   - Copia tu "SMTP Key"

3. **Configura en tu `.env`:**
   ```env
   EMAIL_HOST=smtp-relay.brevo.com
   EMAIL_PORT=587
   EMAIL_USER=tu_email_registrado@brevo.com  ← El email que usaste para registrarte
   EMAIL_PASS=tu_smtp_key_de_brevo  ← La SMTP Key que copiaste
   EMAIL_FROM="Ortopedia CEMYDI <tu_email_registrado@brevo.com>"
   ```

---

## Opción 4: Mailgun - Plan Gratuito (5,000 correos/mes)

### Pasos:

1. **Regístrate en Mailgun:**
   - Ve a: https://www.mailgun.com/
   - Crea cuenta gratuita (verificando tu dominio o usando sandbox)

2. **Obtén tus credenciales:**
   - Ve a: Sending → Domain Settings
   - Copia SMTP credentials

3. **Configura en tu `.env`:**
   ```env
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_USER=postmaster@tu-dominio.mailgun.org
   EMAIL_PASS=tu_password_de_mailgun
   EMAIL_FROM="Ortopedia CEMYDI <noreply@tu-dominio.com>"
   ```

---

## 🔧 Después de configurar:

1. **Guarda el archivo `.env`**
2. **Reinicia el servidor:**
   ```bash
   # Detén el servidor (Ctrl+C)
   npm run start:dev
   ```
3. **Prueba enviando un código de recuperación**

---

## ✅ Verificación:

Si está configurado correctamente, verás en la consola:
```
[EmailService] Correo de recuperación enviado a usuario@email.com. MessageId: ...
```

Si hay errores, revisa:
- Que la contraseña de aplicación sea correcta (sin espacios)
- Que la verificación en 2 pasos esté activada (para Gmail/Outlook)
- Que el puerto y host sean correctos


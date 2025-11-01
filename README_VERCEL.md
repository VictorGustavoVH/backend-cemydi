# 🚀 Guía de Despliegue en Vercel

## Requisitos Previos

1. **Cuenta en Vercel**: https://vercel.com
2. **Base de datos PostgreSQL**: Puedes usar:
   - **Vercel Postgres** (gratis con límites)
   - **Supabase** (gratis con límites)
   - **Neon** (gratis con límites)
   - **Railway** (gratis con límites)
   - Cualquier otro servicio de PostgreSQL

## Paso 1: Preparar el Repositorio

Asegúrate de tener tu código en GitHub, GitLab o Bitbucket.

## Paso 2: Configurar Base de Datos

### Opción A: Vercel Postgres (Recomendado)

1. En tu proyecto de Vercel, ve a **Storage**
2. Crea una base de datos **Postgres**
3. Obtén la `DATABASE_URL` de la conexión

### Opción B: Otra Base de Datos

Usa la cadena de conexión de tu proveedor PostgreSQL.

## Paso 3: Desplegar en Vercel

### Método 1: Desde la Web de Vercel

1. Ve a: https://vercel.com/new
2. Conecta tu repositorio
3. **Configuración del proyecto:**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: (dejar vacío)
   - **Install Command**: `npm install`

### Método 2: Desde la CLI

```bash
cd backend
npm install -g vercel
vercel login
vercel
```

## Paso 4: Configurar Variables de Entorno

En el dashboard de Vercel, ve a tu proyecto → **Settings** → **Environment Variables** y agrega:

### Variables Obligatorias:
```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/database
JWT_SECRET=tu-secret-key-super-segura
JWT_EXPIRES_IN=1d
NODE_ENV=production
```

### Variables de Email (Resend):
```env
# API Key de Resend (obligatoria)
RESEND_API_KEY=re_4gCzcq6e_CKNNUpfkoWX5vv2Y8rwCRNyy

# Email remitente
# Opción 1: Dominio de prueba (recomendado para empezar)
EMAIL_FROM="Ortopedia CEMYDI <onboarding@resend.dev>"

# Opción 2: Si tienes dominio verificado en Resend
EMAIL_FROM="Ortopedia CEMYDI <no-reply@cemydi.com>"
```

📖 **Para más detalles sobre configuración de Resend, consulta:** [CONFIGURAR_RESEND_VERCEL.md](./CONFIGURAR_RESEND_VERCEL.md)

### Variables Opcionales:
```env
PORT=4000
FRONTEND_URL=https://tu-frontend.vercel.app,https://otro-dominio.com
```

**Nota:** El dominio de Netlify (`https://modulousuarioproyecto.netlify.app`) ya está incluido por defecto en el código. Puedes agregar más dominios separándolos con comas en `FRONTEND_URL`.

## Paso 5: Ejecutar Migraciones

Después del despliegue, ejecuta las migraciones de Prisma:

### Opción 1: Desde Vercel CLI
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### Opción 2: Desde el Dashboard de Vercel
1. Ve a tu proyecto
2. Abre **Deployments**
3. Haz clic en los "..." del último deployment
4. Selecciona **View Function Logs**
5. O ejecuta un comando personalizado

### Opción 3: Script de Migración Automática

Agrega esto a `package.json`:
```json
"scripts": {
  "vercel-build": "prisma generate && prisma migrate deploy && nest build"
}
```

## Paso 6: Actualizar Frontend

En tu frontend, actualiza la URL de la API:

```typescript
// frontend/lib/api.ts
export const API_URL = "https://tu-backend.vercel.app";
```

## Troubleshooting

### Error: "Prisma Client not found"
- Asegúrate de que `postinstall` ejecute `prisma generate`
- Verifica que Prisma esté en `dependencies`, no solo en `devDependencies`

### Error: "Cannot find module"
- Verifica que todas las dependencias estén en `dependencies`
- Revisa el build log en Vercel

### Error de conexión a base de datos
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que la base de datos permita conexiones desde Vercel (whitelist de IPs)

### CORS Errors
- El dominio de Netlify (`https://modulousuarioproyecto.netlify.app`) ya está incluido por defecto
- Si tienes otro frontend, agrega su URL en `FRONTEND_URL` separando múltiples URLs con comas
- Verifica que el origen esté permitido en CORS en los logs del backend

## Verificar el Despliegue

1. Ve a: `https://tu-backend.vercel.app`
2. Deberías ver la respuesta del HomeController
3. Prueba: `https://tu-backend.vercel.app/auth/register` (GET) para ver la información

## URLs Importantes

- Dashboard de Vercel: https://vercel.com/dashboard
- Logs del proyecto: Dashboard → Tu Proyecto → Deployments → Ver logs
- Variables de entorno: Dashboard → Tu Proyecto → Settings → Environment Variables


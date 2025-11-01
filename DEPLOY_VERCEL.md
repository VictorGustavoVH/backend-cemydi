# 🚀 Guía de Despliegue en Vercel - Paso a Paso

## 📋 Requisitos Previos

1. ✅ Cuenta en Vercel: https://vercel.com/signup
2. ✅ Repositorio en GitHub/GitLab/Bitbucket
3. ✅ Base de datos PostgreSQL (Vercel Postgres, Supabase, Neon, Railway, etc.)

## 🎯 Paso 1: Preparar la Base de Datos

### Opción Recomendada: Vercel Postgres

1. Ve a tu proyecto en Vercel (después de conectarlo)
2. **Storage** → **Create** → **Postgres**
3. Crea la base de datos
4. Copia la `DATABASE_URL` de la conexión

### O usar otra base de datos PostgreSQL:
- **Supabase**: https://supabase.com (gratis)
- **Neon**: https://neon.tech (gratis)
- **Railway**: https://railway.app (gratis con límites)

## 🎯 Paso 2: Subir Código a Git

Asegúrate de que tu código esté en GitHub/GitLab:

```bash
cd backend
git add .
git commit -m "Preparado para Vercel"
git push
```

## 🎯 Paso 3: Desplegar en Vercel

### Método Web (Recomendado):

1. Ve a: https://vercel.com/new
2. **Conecta tu repositorio** (GitHub/GitLab/Bitbucket)
3. **Configuración del Proyecto:**
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend` (importante!)
   - **Build Command**: `npm run build`
   - **Output Directory**: (dejar vacío)
   - **Install Command**: `npm install`

4. Haz clic en **Deploy**

### Método CLI:

```bash
cd backend
npm install -g vercel
vercel login
vercel
```

## 🎯 Paso 4: Configurar Variables de Entorno

En Vercel Dashboard → Tu Proyecto → **Settings** → **Environment Variables**:

### Variables Obligatorias:

```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/database
JWT_SECRET=tu-secret-key-super-segura-minimo-32-caracteres
JWT_EXPIRES_IN=1d
NODE_ENV=production
```

### Variables de Email (Brevo):

```env
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=9a813b001@smtp-brevo.com
EMAIL_PASS=xsmtpsib-adce5f8ebd0ddcd267f7da3e85de06e70840079518b56aaccb0c76fc5e2585f3-K2OIIuMJNMJCk0Cy
EMAIL_FROM="Ortopedia CEMYDI <9a813b001@smtp-brevo.com>"
```

### Variables Opcionales:

```env
PORT=4000
FRONTEND_URL=https://frontend-cemydi-h7i1fx9z8-equipo6s-projects.vercel.app
```

**⚠️ IMPORTANTE:** 
- Después de agregar variables, **vuelve a desplegar** (Redeploy).
- Asegúrate de actualizar `FRONTEND_URL` con la URL exacta de tu frontend desplegado.

## 🎯 Paso 5: Ejecutar Migraciones

Después del primer despliegue, ejecuta las migraciones:

### Opción 1: Desde Vercel CLI (Recomendado)

```bash
cd backend
vercel env pull .env.local
npx prisma migrate deploy
```

### Opción 2: Script en Vercel

1. En el Dashboard de Vercel
2. Ve a **Deployments**
3. Abre los "..." del último deployment
4. **View Function Logs** → Ejecuta comandos desde ahí

### Opción 3: Automático en Build

Ya configurado en `package.json`:
- `postinstall`: Ejecuta `prisma generate` automáticamente
- `build`: Incluye `prisma generate`

**Nota:** Las migraciones NO se ejecutan automáticamente. Debes hacerlo manualmente la primera vez.

## 🎯 Paso 6: Actualizar Frontend

Después de desplegar el backend, configura la variable de entorno en tu frontend:

1. Ve a tu proyecto frontend en Vercel
2. **Settings** → **Environment Variables**
3. Agrega:
   ```env
   NEXT_PUBLIC_API_URL=https://tu-backend.vercel.app
   ```
4. **Redeploy** el frontend

O edita `frontend/.env.local` (solo para desarrollo local):
```env
NEXT_PUBLIC_API_URL=https://tu-backend.vercel.app
```

## ✅ Verificar el Despliegue

1. **Visita tu URL**: `https://tu-proyecto.vercel.app`
2. **Prueba endpoints:**
   - `GET https://tu-proyecto.vercel.app/auth/register` → Debe mostrar info
   - `POST https://tu-proyecto.vercel.app/auth/register` → Debe funcionar

## 🔧 Troubleshooting

### Error: "Module not found"
- Verifica que todas las dependencias estén en `dependencies` (no solo `devDependencies`)
- Revisa el build log en Vercel

### Error: "Prisma Client not found"
- Verifica que `postinstall` esté en `package.json`
- Revisa que Prisma esté en `dependencies`

### Error: "Cannot connect to database"
- Verifica `DATABASE_URL` en Environment Variables
- Asegúrate de que la base de datos permita conexiones externas
- Ejecuta las migraciones: `npx prisma migrate deploy`

### Timeout en cold start
- Es normal en Vercel (serverless)
- El primer request puede tardar ~5-10 segundos
- Los siguientes requests son rápidos (warm start)

### CORS Errors
- Actualiza `FRONTEND_URL` con la URL exacta de tu frontend
- Ejemplo: `https://tu-frontend.vercel.app`

## 📝 Checklist Final

- [ ] Código en Git
- [ ] Proyecto conectado en Vercel
- [ ] Root Directory: `backend`
- [ ] Variables de entorno configuradas
- [ ] Base de datos creada y accesible
- [ ] Migraciones ejecutadas
- [ ] Frontend actualizado con nueva URL
- [ ] Probar endpoints principales

## 🎉 ¡Listo!

Tu backend debería estar funcionando en: `https://tu-proyecto.vercel.app`


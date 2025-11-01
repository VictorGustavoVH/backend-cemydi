# 👤 Crear Usuario Administrador Inicial

## Método 1: Crear Admin Manualmente (Recomendado)

### Opción A: Desde el código (temporal)

Puedes crear un usuario admin directamente en la base de datos o temporalmente modificar el registro para asignar rol "admin":

1. **Crear usuario normal primero** (desde el frontend o API):
```bash
POST /auth/register
{
  "name": "Administrador",
  "email": "admin@cemydi.com",
  "password": "Admin123!"
}
```

2. **Actualizar el rol a admin desde la base de datos**:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@cemydi.com';
```

### Opción B: Crear directamente con rol admin (si tienes acceso a Prisma Studio o base de datos)

1. Abre Prisma Studio:
```bash
cd backend
npx prisma studio
```

2. Ve a la tabla `users`
3. Crea un nuevo usuario con:
   - name: "Administrador"
   - email: "admin@cemydi.com"
   - password: (hash de tu contraseña - usa bcrypt)
   - role: "admin"

## Método 2: Script de Bootstrap (Opcional)

Si quieres automatizar la creación de admin inicial, puedes crear un script:

```typescript
// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cemydi.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Usuario admin ya existe');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Usuario admin creado:', admin.email);
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Verificar que Funciona

1. **Login como admin:**
```bash
POST /auth/login
{
  "email": "admin@cemydi.com",
  "password": "Admin123!"
}
```

2. **Usar el token para acceder a /users:**
```bash
GET /users
Authorization: Bearer <token>
```

3. **Deberías ver la lista de usuarios** ✅

## Cambiar Rol de un Usuario Existente a Admin

Si ya tienes usuarios creados y quieres convertir uno en admin:

1. **Login como cualquier usuario** (o usar el primer admin si ya existe)
2. **Cambiar el rol** (requiere ser admin):
```bash
PATCH /users/:id/role
Authorization: Bearer <admin-token>
{
  "role": "admin"
}
```

**Nota:** Una vez tengas al menos un admin, ese admin puede cambiar roles de otros usuarios.


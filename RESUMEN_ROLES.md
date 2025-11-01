# 📋 Resumen: Sistema de Roles y Permisos Implementado

## ✅ Implementación Completa

### Archivos Creados
1. **`src/auth/decorators/roles.decorator.ts`**
   - Decorador `@Roles(...roles)` para definir roles requeridos

2. **`src/auth/guards/roles.guard.ts`**
   - Guard que verifica el rol del usuario desde el JWT
   - Se combina con `JwtAuthGuard`

3. **`src/users/dto/update-role.dto.ts`**
   - DTO para cambiar el rol de un usuario
   - Valida que el rol sea "admin" o "client"

### Archivos Modificados
1. **`prisma/schema.prisma`**
   - Cambiado `role` default de `"user"` a `"client"`

2. **`src/auth/auth.service.ts`**
   - Registro ahora crea usuarios con `role: "client"`

3. **`src/users/users.service.ts`**
   - Agregado método `updateRole()` con validaciones
   - Modificado `remove()` para prevenir auto-eliminación
   - Default role cambiado a `"client"`

4. **`src/users/users.controller.ts`**
   - Todas las rutas protegidas con `@Roles('admin')`
   - Agregado endpoint `PATCH /users/:id/role`

## 🔐 Roles Disponibles

### `admin`
- ✅ Acceso completo a `/users` (GET, POST, PATCH, DELETE)
- ✅ Puede cambiar roles de otros usuarios
- ✅ Puede listar, editar y eliminar usuarios
- ❌ **NO puede** eliminarse a sí mismo
- ❌ **NO puede** cambiar su propio rol

### `client`
- ✅ Puede autenticarse (login/register)
- ✅ Puede acceder a rutas básicas no protegidas
- ❌ **NO puede** acceder a `/users`
- ❌ **NO puede** cambiar roles
- ❌ **NO puede** ver ni editar otros usuarios

## 🛡️ Protecciones Implementadas

### Nivel de Controlador
```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UsersController { ... }
```
Todas las rutas de `/users` requieren autenticación JWT + rol admin.

### Nivel de Método
```typescript
@Patch(':id/role')
@Roles('admin')
updateRole(...) { ... }
```

### Validaciones de Negocio
1. **Auto-eliminación:** Admin no puede eliminarse a sí mismo
2. **Auto-cambio de rol:** Usuario no puede cambiar su propio rol
3. **Validación de rol:** Solo acepta "admin" o "client"

## 📡 Endpoints Disponibles

### Públicos (Sin Autenticación)
- `POST /auth/register` - Registro (crea con `role: "client"`)
- `POST /auth/login` - Login (retorna token con `role`)
- `POST /auth/request-password-reset` - Recuperación de contraseña
- `POST /auth/verify-reset-code` - Verificar código
- `POST /auth/reset-password` - Resetear contraseña

### Protegidos - Solo Admin
- `GET /users` - Listar todos los usuarios
- `GET /users/:id` - Ver usuario específico
- `POST /users` - Crear usuario (admin puede crear con cualquier rol)
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario (excepto a sí mismo)
- `PATCH /users/:id/role` - Cambiar rol de usuario (excepto el propio)

## 🔑 Flujo de Autenticación

1. **Usuario se registra/login:**
   ```typescript
   POST /auth/register → JWT con { sub, email, role: "client" }
   POST /auth/login → JWT con { sub, email, role: <rol-del-usuario> }
   ```

2. **JwtStrategy extrae el rol:**
   ```typescript
   validate(payload) {
     return { userId: payload.sub, email: payload.email, role: payload.role };
   }
   ```

3. **RolesGuard verifica:**
   ```typescript
   const hasRole = requiredRoles.some(role => user.role === role);
   if (!hasRole) throw ForbiddenException();
   ```

## 🧪 Pruebas Rápidas

### 1. Crear y probar cliente:
```bash
# Registrar
POST /auth/register { "name": "Cliente", "email": "c@test.com", "password": "Pass123!" }

# Login
POST /auth/login { "email": "c@test.com", "password": "Pass123!" }
# Guardar el token

# Intentar acceder (debe fallar)
GET /users
Authorization: Bearer <token>
# → 403 Forbidden
```

### 2. Crear y probar admin:
```bash
# Convertir usuario a admin (desde BD):
UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';

# Login como admin
POST /auth/login { "email": "admin@test.com", "password": "..." }
# Guardar el token

# Acceder a /users (debe funcionar)
GET /users
Authorization: Bearer <admin-token>
# → 200 OK con lista de usuarios
```

## 📚 Documentación de Referencia

- **Crear Admin:** Ver `CREAR_USUARIO_ADMIN.md`
- **Probar Sistema:** Ver `TESTING_ROLES.md`
- **Decorador Roles:** `src/auth/decorators/roles.decorator.ts`
- **RolesGuard:** `src/auth/guards/roles.guard.ts`

## 🎯 Casos de Uso

### Caso 1: Usuario se registra
→ Creado automáticamente con `role: "client"`
→ Solo puede acceder a rutas públicas y su perfil

### Caso 2: Admin necesita gestionar usuarios
→ Login como admin
→ Accede a `/users` sin problemas
→ Puede listar, editar, eliminar y cambiar roles

### Caso 3: Convertir cliente a admin
→ Admin hace login
→ `PATCH /users/:id/role { "role": "admin" }`
→ Cliente ahora es admin

### Caso 4: Cliente intenta acceder a panel admin
→ Cliente hace login
→ Intenta `GET /users`
→ Recibe `403 Forbidden` con mensaje claro

## ✨ Características Adicionales

- ✅ Mensajes de error claros y descriptivos
- ✅ Validación de DTOs con class-validator
- ✅ Prevención de auto-eliminación
- ✅ Prevención de auto-cambio de rol
- ✅ Compatible con múltiples roles (extensible)
- ✅ Integrado con JWT existente
- ✅ Sin dependencias adicionales

---

**Estado:** ✅ **Listo para producción**

El sistema de roles está completamente implementado y probado. Solo falta crear un usuario administrador inicial para comenzar a usarlo.


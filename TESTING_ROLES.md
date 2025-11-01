# 🧪 Guía de Pruebas - Sistema de Roles y Permisos

## 📋 Prerequisitos

1. Servidor backend corriendo (`npm run start:dev`)
2. Base de datos sincronizada (ya hecho con `prisma db push`)
3. Al menos un usuario creado

## 🧪 Escenarios de Prueba

### Escenario 1: Crear Usuario Cliente (Registro Normal)

```bash
POST http://localhost:4000/auth/register
Content-Type: application/json

{
  "name": "Usuario Cliente",
  "email": "cliente@ejemplo.com",
  "password": "Cliente123!"
}
```

**Resultado esperado:**
- ✅ Usuario creado con `role: "client"`
- ✅ Token JWT generado con `role: "client"` en el payload
- ✅ Respuesta incluye el user object con `role: "client"`

### Escenario 2: Login como Cliente

```bash
POST http://localhost:4000/auth/login
Content-Type: application/json

{
  "email": "cliente@ejemplo.com",
  "password": "Cliente123!"
}
```

**Resultado esperado:**
- ✅ Token JWT generado
- ✅ Token incluye `role: "client"` en el payload

### Escenario 3: Cliente Intenta Acceder a /users (Debe Fallar)

```bash
GET http://localhost:4000/users
Authorization: Bearer <token-del-cliente>
```

**Resultado esperado:**
- ❌ **403 Forbidden**
- Mensaje: `"Acceso denegado: se requiere uno de los siguientes roles: admin"`

### Escenario 4: Crear Usuario Administrador

**Opción A: Desde Base de Datos (SQL)**
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@ejemplo.com';
```

**Opción B: Si ya tienes otro admin, usar el endpoint:**
```bash
PATCH http://localhost:4000/users/:id/role
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "role": "admin"
}
```

### Escenario 5: Login como Administrador

```bash
POST http://localhost:4000/auth/login
Content-Type: application/json

{
  "email": "admin@ejemplo.com",
  "password": "Admin123!"
}
```

**Resultado esperado:**
- ✅ Token JWT generado
- ✅ Token incluye `role: "admin"` en el payload

### Escenario 6: Administrador Accede a /users (Debe Funcionar)

```bash
GET http://localhost:4000/users
Authorization: Bearer <token-del-admin>
```

**Resultado esperado:**
- ✅ **200 OK**
- Lista de usuarios retornada

### Escenario 7: Administrador Cambia Rol de Otro Usuario

```bash
PATCH http://localhost:4000/users/<id-del-cliente>/role
Authorization: Bearer <token-del-admin>
Content-Type: application/json

{
  "role": "admin"
}
```

**Resultado esperado:**
- ✅ **200 OK**
- Mensaje: `"Rol del usuario actualizado a \"admin\""`
- User object actualizado con nuevo rol

### Escenario 8: Administrador Intenta Eliminarse a Sí Mismo (Debe Fallar)

```bash
DELETE http://localhost:4000/users/<id-del-admin>
Authorization: Bearer <token-del-admin>
```

**Resultado esperado:**
- ❌ **403 Forbidden**
- Mensaje: `"No puedes eliminarte a ti mismo"`

### Escenario 9: Administrador Intenta Cambiar Su Propio Rol (Debe Fallar)

```bash
PATCH http://localhost:4000/users/<id-del-admin>/role
Authorization: Bearer <token-del-admin>
Content-Type: application/json

{
  "role": "client"
}
```

**Resultado esperado:**
- ❌ **403 Forbidden**
- Mensaje: `"No puedes cambiar tu propio rol"`

### Escenario 10: Cliente Intenta Cambiar Su Propio Rol (Debe Fallar)

```bash
PATCH http://localhost:4000/users/<id-del-cliente>/role
Authorization: Bearer <token-del-cliente>
Content-Type: application/json

{
  "role": "admin"
}
```

**Resultado esperado:**
- ❌ **403 Forbidden** (primero bloqueado por RolesGuard)
- Mensaje: `"Acceso denegado: se requiere uno de los siguientes roles: admin"`

## 📝 Checklist de Verificación

- [ ] Usuario cliente puede registrarse (`role: "client"` por defecto)
- [ ] Cliente recibe 403 al intentar acceder a `/users`
- [ ] Usuario admin puede hacer login
- [ ] Admin puede listar usuarios (`GET /users`)
- [ ] Admin puede ver usuario específico (`GET /users/:id`)
- [ ] Admin puede actualizar usuario (`PATCH /users/:id`)
- [ ] Admin puede cambiar rol de otro usuario (`PATCH /users/:id/role`)
- [ ] Admin **NO puede** eliminarse a sí mismo (`DELETE /users/:id` → 403)
- [ ] Admin **NO puede** cambiar su propio rol (`PATCH /users/:id/role` → 403)
- [ ] Cliente **NO puede** acceder a ninguna ruta de `/users` (403 en todas)

## 🔍 Verificar JWT Payload

Para verificar que el JWT incluye el rol correcto, puedes decodificar el token en:

- https://jwt.io
- O usar una librería en Node.js:

```javascript
const jwt = require('jsonwebtoken');
const token = 'tu-token-aqui';
const decoded = jwt.decode(token);
console.log(decoded); // Debe incluir { sub, email, role, ... }
```

## 📊 Flujo Completo de Ejemplo

1. **Registrar cliente:**
   ```
   POST /auth/register → Usuario creado (role: "client")
   ```

2. **Login cliente:**
   ```
   POST /auth/login → Token con role: "client"
   ```

3. **Cliente intenta ver usuarios:**
   ```
   GET /users → 403 Forbidden ❌
   ```

4. **Crear admin** (desde BD o con otro admin):
   ```
   UPDATE users SET role = 'admin' WHERE email = 'admin@ejemplo.com'
   ```

5. **Login admin:**
   ```
   POST /auth/login → Token con role: "admin"
   ```

6. **Admin ve usuarios:**
   ```
   GET /users → 200 OK ✅
   ```

7. **Admin cambia rol de cliente:**
   ```
   PATCH /users/:id/role { "role": "admin" } → 200 OK ✅
   ```

## 🚨 Errores Comunes

### Error: "Reflector is not defined"
**Solución:** NestJS incluye Reflector automáticamente, no necesita ser importado manualmente.

### Error: "RolesGuard is not provided"
**Solución:** RolesGuard es un guard, no necesita estar en providers. Se usa directamente con `@UseGuards()`.

### Error: "403 pero no veo el mensaje"
**Solución:** Verifica que el token incluya el campo `role` en el payload.

### Los usuarios antiguos tienen role="user"
**Solución:** Ejecuta:
```sql
UPDATE users SET role = 'client' WHERE role = 'user';
```


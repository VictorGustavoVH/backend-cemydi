# 📋 Endpoints de Gestión de Usuarios (Solo Admin)

Todos los endpoints de `/users` están protegidos con `@Roles('admin')` y requieren autenticación JWT.

## 🔐 Autenticación Requerida

Todos los endpoints requieren:
- Header: `Authorization: Bearer <token>`
- Token JWT válido
- Rol del usuario: `admin`

Si no cumple estos requisitos, recibirá `401 Unauthorized` o `403 Forbidden`.

---

## 📡 Endpoints Disponibles

### 1. GET /users
**Listar todos los usuarios**

**Descripción:** Retorna una lista de todos los usuarios registrados (sin contraseñas).

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": "uuid-del-usuario",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "role": "client",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  },
  {
    "id": "uuid-del-admin",
    "name": "Admin",
    "email": "admin@ejemplo.com",
    "role": "admin",
    "createdAt": "2025-01-10T08:00:00.000Z",
    "updatedAt": "2025-01-10T08:00:00.000Z"
  }
]
```

**Errores posibles:**
- `401 Unauthorized` - Token inválido o expirado
- `403 Forbidden` - Usuario no tiene rol `admin`

---

### 2. GET /users/:id
**Ver detalles de un usuario específico**

**Descripción:** Retorna los datos de un usuario por su ID (sin contraseña).

**Headers:**
```
Authorization: Bearer <token>
```

**Parámetros:**
- `id` (string, UUID) - ID del usuario a consultar

**Respuesta exitosa (200 OK):**
```json
{
  "id": "uuid-del-usuario",
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "role": "client",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

**Errores posibles:**
- `404 Not Found` - Usuario no encontrado
- `401 Unauthorized` - Token inválido
- `403 Forbidden` - Usuario no tiene rol `admin`

---

### 3. PATCH /users/:id
**Editar datos básicos de un usuario**

**Descripción:** Permite actualizar el nombre, email y/o contraseña de un usuario. **NO permite cambiar el rol** (usa `/users/:id/role` para eso).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parámetros:**
- `id` (string, UUID) - ID del usuario a editar

**Body (todos los campos son opcionales):**
```json
{
  "name": "Nuevo Nombre",
  "email": "nuevo@email.com",
  "password": "NuevaContraseña123!"
}
```

**Validaciones:**
- `name`: Mínimo 2 caracteres
- `email`: Debe ser un email válido y único
- `password`: Mínimo 8 caracteres (si se proporciona, se cifrará automáticamente)

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Usuario actualizado exitosamente",
  "user": {
    "id": "uuid-del-usuario",
    "name": "Nuevo Nombre",
    "email": "nuevo@email.com",
    "role": "client",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
}
```

**Errores posibles:**
- `400 Bad Request` - Validación fallida o intento de cambiar rol
- `404 Not Found` - Usuario no encontrado
- `409 Conflict` - El email ya está en uso
- `401 Unauthorized` - Token inválido
- `403 Forbidden` - Usuario no tiene rol `admin`

**Nota:** Si intentas incluir `role` en el body, recibirás:
```json
{
  "statusCode": 400,
  "message": "Para cambiar el rol de un usuario, utiliza el endpoint PATCH /users/:id/role"
}
```

---

### 4. PATCH /users/:id/role
**Cambiar el rol de un usuario**

**Descripción:** Permite cambiar el rol de un usuario entre `admin` y `client`.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parámetros:**
- `id` (string, UUID) - ID del usuario cuyo rol se va a cambiar

**Body (requerido):**
```json
{
  "role": "admin"
}
```

O:
```json
{
  "role": "client"
}
```

**Validaciones:**
- Solo acepta `"admin"` o `"client"`
- Un usuario **NO puede cambiar su propio rol**

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Rol del usuario actualizado a \"admin\"",
  "user": {
    "id": "uuid-del-usuario",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "role": "admin",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
}
```

**Errores posibles:**
- `400 Bad Request` - Rol inválido
- `403 Forbidden` - Intento de cambiar tu propio rol o no tienes permisos
- `404 Not Found` - Usuario no encontrado
- `401 Unauthorized` - Token inválido

**Ejemplo de error (auto-cambio):**
```json
{
  "statusCode": 403,
  "message": "No puedes cambiar tu propio rol"
}
```

---

### 5. DELETE /users/:id
**Eliminar un usuario**

**Descripción:** Elimina permanentemente un usuario del sistema.

**Headers:**
```
Authorization: Bearer <token>
```

**Parámetros:**
- `id` (string, UUID) - ID del usuario a eliminar

**Respuesta exitosa (204 No Content):**
- Sin body, solo código 204

**Validaciones:**
- Un administrador **NO puede eliminarse a sí mismo**

**Errores posibles:**
- `403 Forbidden` - Intento de auto-eliminación o no tienes permisos
- `404 Not Found` - Usuario no encontrado
- `401 Unauthorized` - Token inválido

**Ejemplo de error (auto-eliminación):**
```json
{
  "statusCode": 403,
  "message": "No puedes eliminarte a ti mismo"
}
```

---

### 6. POST /users
**Crear un nuevo usuario (Admin)**

**Descripción:** Permite a un administrador crear un nuevo usuario manualmente.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@ejemplo.com",
  "password": "Contraseña123!",
  "role": "client"
}
```

**Campos:**
- `name` (requerido): Mínimo 2 caracteres
- `email` (requerido): Email válido y único
- `password` (requerido): Mínimo 6 caracteres
- `role` (opcional): `"admin"` o `"client"` (default: `"client"`)

**Respuesta exitosa (201 Created):**
```json
{
  "id": "uuid-del-nuevo-usuario",
  "name": "Nuevo Usuario",
  "email": "nuevo@ejemplo.com",
  "role": "client",
  "createdAt": "2025-01-15T12:00:00.000Z",
  "updatedAt": "2025-01-15T12:00:00.000Z"
}
```

**Errores posibles:**
- `409 Conflict` - El email ya está registrado
- `400 Bad Request` - Validación fallida
- `401 Unauthorized` - Token inválido
- `403 Forbidden` - Usuario no tiene rol `admin`

---

## 🧪 Ejemplos de Uso con cURL

### Listar usuarios
```bash
curl -X GET https://tu-backend.vercel.app/users \
  -H "Authorization: Bearer tu-token-jwt"
```

### Ver usuario específico
```bash
curl -X GET https://tu-backend.vercel.app/users/uuid-del-usuario \
  -H "Authorization: Bearer tu-token-jwt"
```

### Editar usuario
```bash
curl -X PATCH https://tu-backend.vercel.app/users/uuid-del-usuario \
  -H "Authorization: Bearer tu-token-jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nombre Actualizado",
    "email": "nuevo@email.com"
  }'
```

### Cambiar rol
```bash
curl -X PATCH https://tu-backend.vercel.app/users/uuid-del-usuario/role \
  -H "Authorization: Bearer tu-token-jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

### Eliminar usuario
```bash
curl -X DELETE https://tu-backend.vercel.app/users/uuid-del-usuario \
  -H "Authorization: Bearer tu-token-jwt"
```

---

## ✅ Características de Seguridad

1. **Passwords nunca se retornan:** Todos los endpoints excluyen el campo `password` de las respuestas.

2. **Auto-eliminación bloqueada:** Un admin no puede eliminarse a sí mismo.

3. **Auto-cambio de rol bloqueado:** Un usuario no puede cambiar su propio rol.

4. **Validación de email único:** No se permite duplicar emails.

5. **Separación de responsabilidades:** 
   - `PATCH /users/:id` → Editar datos básicos (sin rol)
   - `PATCH /users/:id/role` → Cambiar solo el rol

6. **Protección por roles:** Solo usuarios con `role: "admin"` pueden acceder.

---

## 📊 Resumen de Endpoints

| Método | Ruta | Descripción | Protección |
|--------|------|-------------|------------|
| GET | `/users` | Listar usuarios | Admin |
| GET | `/users/:id` | Ver usuario | Admin |
| POST | `/users` | Crear usuario | Admin |
| PATCH | `/users/:id` | Editar usuario | Admin |
| PATCH | `/users/:id/role` | Cambiar rol | Admin |
| DELETE | `/users/:id` | Eliminar usuario | Admin |

Todos los endpoints están listos para usar desde el frontend. 🚀


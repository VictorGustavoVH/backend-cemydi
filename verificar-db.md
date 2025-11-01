# Cómo verificar tu conexión a PostgreSQL

## Tu URL de base de datos actual:
```
postgresql://postgres:victor123@localhost:5432/bd_ortopedia_cemydi
```

## Formato correcto de DATABASE_URL:
```
postgresql://usuario:contraseña@host:puerto/nombre_base_datos?schema=public
```

**Componentes:**
- `postgresql://` - Protocolo
- `postgres` - Usuario
- `victor123` - Contraseña
- `localhost` - Host (o IP del servidor)
- `5432` - Puerto (default de PostgreSQL)
- `bd_ortopedia_cemydi` - Nombre de la base de datos

## Métodos para verificar la conexión:

### Método 1: Usar Prisma directamente
```bash
cd backend
npx prisma db pull
```
Si funciona, verás las tablas existentes en tu base de datos.

### Método 2: Verificar con psql (si lo tienes instalado)
```bash
psql -h localhost -U postgres -d bd_ortopedia_cemydi
```
Te pedirá la contraseña: `victor123`

### Método 3: Verificar que PostgreSQL esté corriendo
```powershell
Get-Service -Name "*postgresql*"
```

### Método 4: Probar con Node.js directamente
Crear un archivo temporal para probar:

```javascript
// test-db.js
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'victor123',
  database: 'bd_ortopedia_cemydi'
});

client.connect()
  .then(() => {
    console.log('✅ Conexión exitosa!');
    return client.query('SELECT version()');
  })
  .then((res) => {
    console.log('Versión PostgreSQL:', res.rows[0].version);
    client.end();
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    client.end();
  });
```

## Errores comunes:

1. **P1001: Can't reach database server**
   - PostgreSQL no está corriendo
   - Solución: Inicia el servicio de PostgreSQL

2. **P1000: Authentication failed**
   - Usuario o contraseña incorrectos
   - Solución: Verifica las credenciales

3. **P1003: Database does not exist**
   - La base de datos `bd_ortopedia_cemydi` no existe
   - Solución: Crea la base de datos con:
     ```sql
     CREATE DATABASE bd_ortopedia_cemydi;
     ```

4. **Connection timeout**
   - El puerto 5432 está bloqueado o incorrecto
   - Solución: Verifica el puerto en la configuración de PostgreSQL


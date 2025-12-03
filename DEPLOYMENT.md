# Deployment a Vercel - Pastelería Mil Sabores

## 🚀 Configuración del Frontend

### Variables de Entorno en Vercel

Configura la siguiente variable de entorno en tu proyecto de Vercel:

**Dashboard de Vercel → Settings → Environment Variables:**

| Variable | Value | Scopes |
|----------|-------|--------|
| `VITE_API_URL` | `https://pasteleria-backend-nine.vercel.app/api` | Production, Preview, Development |

### Pasos para Deploy

1. **Conectar repositorio a Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Import Git Repository
   - Selecciona este repositorio

2. **Configurar Build Settings:**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Agregar Environment Variable:**
   ```
   VITE_API_URL = https://pasteleria-backend-nine.vercel.app/api
   ```

4. **Deploy:**
   - Click en "Deploy"
   - Espera a que termine el build

### Desarrollo Local

1. **Copiar archivo de configuración:**
   ```bash
   copy .env.example .env
   ```

2. **Para desarrollo con backend local:**
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

3. **Para desarrollo contra backend de Vercel:**
   ```env
   VITE_API_URL=https://pasteleria-backend-nine.vercel.app/api
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

### Verificación del Backend

El backend en Vercel está disponible en:
- **Base URL:** `https://pasteleria-backend-nine.vercel.app/api`
- **Health Check:** `https://pasteleria-backend-nine.vercel.app/health`

#### Endpoints principales:

**Autenticación:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (requiere token)
- `PUT /api/auth/profile` (requiere token)

**Productos:**
- `GET /api/products` (público)
- `GET /api/products/:id` (público)

**Órdenes:**
- `POST /api/orders` (requiere token)
- `GET /api/orders` (requiere token)

### Autenticación

El backend usa **JWT tokens** en el header `Authorization`:

```javascript
Authorization: Bearer <token>
```

Los tokens:
- Se obtienen al hacer login o registro
- Expiran en 7 días
- Se guardan en `localStorage` con la clave `token`

### Usuario de Prueba

```
Email: hert666uc@gmail.com
Password: 123456
```

### Estructura de Respuestas

**Éxito:**
```json
{
  "message": "Login exitoso",
  "statusCode": 200,
  "data": {
    "user": {...},
    "token": "eyJhbGci..."
  }
}
```

**Error:**
```json
{
  "message": "Credenciales inválidas",
  "statusCode": 401
}
```

### CORS

El backend tiene CORS configurado para aceptar requests desde cualquier origen (`origin: '*'`), por lo que no hay restricciones adicionales.

### Troubleshooting

#### Error de conexión al backend

1. Verifica que `VITE_API_URL` esté configurada correctamente
2. Prueba el health check: `https://pasteleria-backend-nine.vercel.app/health`
3. Revisa la consola del navegador para errores de CORS o network

#### Token expirado o inválido

- El interceptor de axios redirige automáticamente a `/login` en caso de error 401
- Los tokens se limpian automáticamente del localStorage

#### Desarrollo local con backend remoto

Si quieres usar el backend de Vercel en desarrollo local:

```bash
# .env
VITE_API_URL=https://pasteleria-backend-nine.vercel.app/api
```

```bash
npm run dev
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

### Configuración de vercel.json

El proyecto ya incluye `vercel.json` para configuración del frontend. No requiere cambios adicionales.

### Notas Importantes

- ⚠️ **No commitear** archivos `.env` (ya están en `.gitignore`)
- ✅ Siempre usar `.env.example` como referencia
- ✅ Configurar `VITE_API_URL` en Vercel Dashboard para cada ambiente
- ✅ El fallback por defecto apunta a producción si no hay variable configurada

### Monitoreo

Después del deploy, verifica:

1. ✅ Frontend carga correctamente
2. ✅ Login funciona con usuario de prueba
3. ✅ Productos se cargan desde el backend
4. ✅ Checkout crea órdenes
5. ✅ Perfil muestra información del usuario

---

## 📞 Soporte

Backend URL: https://pasteleria-backend-nine.vercel.app
Health Check: https://pasteleria-backend-nine.vercel.app/health

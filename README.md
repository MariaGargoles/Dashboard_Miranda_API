# 🏨 Miranda Hotel Dashboard API

API RESTful para gestión de hotel Miranda, construida con Node.js, Express, TypeScript y MongoDB.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Desarrollo](#desarrollo)

## ✨ Características

- 🔐 **Autenticación JWT** con rate limiting para prevenir ataques de fuerza bruta
- 🛡️ **Seguridad avanzada** con Helmet, CORS configurado y validación de entrada
- 📊 **Paginación** en todas las consultas de listado
- 📝 **Validación robusta** de entrada con express-validator
- 🪵 **Logging profesional** con Winston
- 🚀 **Deployment serverless** en AWS Lambda
- 📖 **Documentación API** con Swagger
- 🎯 **TypeScript** para seguridad de tipos
- ⚡ **Rate Limiting** para protección contra abusos

## 🛠 Tecnologías

- **Backend**: Node.js, Express.js, TypeScript
- **Base de datos**: MongoDB con Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Express Validator
- **Seguridad**: Helmet, bcryptjs, CORS
- **Logging**: Winston
- **API Documentation**: Swagger
- **Deployment**: Serverless Framework (AWS Lambda)
- **Linting**: ESLint, Prettier

## 📦 Requisitos Previos

- Node.js >= 18.x
- MongoDB >= 6.x
- npm o yarn
- AWS CLI (para deployment)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd DashBoard_Miranda_API
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
PORT=3002
NODE_ENV=development
MONGODB_URI=tu_mongodb_uri_aqui
TOKEN_SECRET=tu_secret_jwt_aqui
DOMAIN_FRONT=http://localhost:3000
AWS_REGION=eu-west-3
```

## ⚙️ Configuración

### MongoDB

Asegúrate de tener MongoDB corriendo localmente o usa MongoDB Atlas:

```bash
# Local
mongod

# O configura MongoDB Atlas en .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### Seed de datos

Para poblar la base de datos con datos de prueba:

```bash
npm run build
node dist/seed.js
```

## 💻 Uso

### Desarrollo

```bash
# Modo desarrollo con hot-reload
npm run dev

# O usando nodemon
npm start
```

La API estará disponible en `http://localhost:3002`

### Producción

```bash
# Compilar TypeScript
npm run build

# Iniciar servidor de producción
NODE_ENV=production node dist/server.js
```

### Linting y Formato

```bash
# Ejecutar linter
npm run lint

# Corregir problemas automáticamente
npm run lint:fix

# Formatear código
npm run format

# Verificar formato
npm run format:check
```

## 📍 API Endpoints

### Autenticación

#### POST /login
Autenticar usuario y obtener token JWT

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "photo": "photo_url",
    "status": "ACTIVE"
  }
}
```

### Health Check

#### GET /health
Verificar estado del servidor

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345,
  "environment": "development"
}
```

### Recursos Protegidos

> 🔒 Todos los endpoints siguientes requieren autenticación JWT en el header:
> `Authorization: Bearer <token>`

### Usuarios

- `GET /users` - Listar usuarios (con paginación)
- `GET /users/:id` - Obtener usuario por ID
- `POST /users` - Crear nuevo usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Habitaciones

- `GET /rooms` - Listar habitaciones (con paginación)
- `GET /rooms/:id` - Obtener habitación por ID
- `POST /rooms` - Crear nueva habitación
- `POST /rooms/:id/update` - Actualizar habitación
- `DELETE /rooms/:id` - Eliminar habitación

### Reservas

- `GET /booking` - Listar reservas (con paginación)
- `GET /booking/:id` - Obtener reserva por ID
- `POST /booking` - Crear nueva reserva
- `PATCH /booking/:id` - Actualizar reserva
- `DELETE /booking/:id` - Eliminar reserva

### Mensajes de Contacto

- `GET /contact` - Listar mensajes (con paginación)
- `GET /contact/:id` - Obtener mensaje por ID
- `POST /contact` - Crear nuevo mensaje
- `PATCH /contact/:id` - Actualizar mensaje
- `DELETE /contact/:id` - Eliminar mensaje

### Paginación

Todos los endpoints GET que retornan listas soportan paginación:

```bash
GET /users?page=1&limit=10
```

**Response con paginación:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🚀 Deployment

### Serverless (AWS Lambda)

1. **Configurar AWS CLI**
```bash
aws configure
```

2. **Configurar variables de entorno en AWS**

Crea un archivo `.env` con tus credenciales de producción.

3. **Deployment**
```bash
npm run deploy
```

Esto compilará TypeScript y desplegará a AWS Lambda usando Serverless Framework.

### Variables de Entorno en AWS

Asegúrate de configurar las siguientes variables en AWS Systems Manager Parameter Store o Secrets Manager:

- `TOKEN_SECRET`
- `MONGODB_URI`
- `DOMAIN_FRONT`

## 🔒 Seguridad

La API implementa múltiples capas de seguridad:

- ✅ **Helmet.js** para headers HTTP seguros
- ✅ **CORS** configurado con origen específico
- ✅ **Rate Limiting** en todos los endpoints
- ✅ **Rate Limiting especial** en login (5 intentos / 15 min)
- ✅ **Validación de entrada** con express-validator
- ✅ **Contraseñas hasheadas** con bcryptjs
- ✅ **JWT con expiración** (8 horas)
- ✅ **Logs de seguridad** con Winston

## 🧪 Testing

```bash
npm test
```

## 📝 Estructura del Proyecto

```
src/
├── controllers/      # Controladores de rutas
├── interfaces/       # Interfaces TypeScript
├── middleware/       # Middlewares (auth, validators, rate limiting)
├── models/          # Modelos de Mongoose
├── services/        # Lógica de negocio
├── utils/           # Utilidades (logger, error handler)
├── nodata/          # Datos de seed
├── app.ts           # Configuración Express
├── server.ts        # Servidor local
├── lambda.ts        # Handler para AWS Lambda
└── mongodb.ts       # Conexión MongoDB
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👤 Autor

Dashboard Miranda API

---

⭐ Si este proyecto te ha sido útil, considera darle una estrella!


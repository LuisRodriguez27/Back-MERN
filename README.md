# MERN Backend - API REST

API backend simple para una aplicación MERN con operaciones CRUD para Usuarios y Productos.

## 🚀 Tecnologías

- **Node.js** con **Express**
- **TypeScript** para tipado estático
- **MongoDB** como base de datos
- **CORS** configurado para el frontend
- **Morgan** para logging

## 📦 Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno en `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tu_base_de_datos
```

4. Ejecuta en modo desarrollo:
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
src/
├── controllers/        # Lógica de controladores
│   ├── userController.ts
│   └── productController.ts
├── models/            # Interfaces de TypeScript
│   ├── User.ts
│   └── Product.ts
├── routes/            # Definición de rutas
│   ├── userRoutes.ts
│   └── productRoutes.ts
├── database/          # Configuración de BD
│   └── connection.ts
└── index.ts          # Archivo principal
```

## 🛠 API Endpoints

### Usuarios (`/api/users`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Obtener todos los usuarios |
| GET | `/api/users/:id` | Obtener usuario por ID |
| POST | `/api/users` | Crear nuevo usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

#### Modelo de Usuario:
```json
{
  "name": "string",
  "email": "string",
  "number": "string",
  "idProducts": ["ObjectId"]
}
```

### Productos (`/api/products`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Obtener todos los productos |
| GET | `/api/products/:id` | Obtener producto por ID |
| POST | `/api/products` | Crear nuevo producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto |

#### Modelo de Producto:
```json
{
  "name": "string",
  "description": "string",
  "price": "number"
}
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Compilar TypeScript
- `npm start` - Ejecutar en producción

## 🌐 CORS

El servidor está configurado para permitir conexiones desde:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

## 📝 Notas

- Todas las respuestas siguen el formato: `{ success: boolean, data?: any, message: string }`
- Los IDs de MongoDB son validados automáticamente
- Las fechas `createdAt` y `updatedAt` se manejan automáticamente
- Manejo básico de errores implementado

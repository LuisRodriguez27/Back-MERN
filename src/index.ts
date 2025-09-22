import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './database/connection';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173',
    /^http:\/\/192\.168\.\d+\.\d+:5173$/, // Cualquier IP 192.168.x.x en puerto 5173
    /^http:\/\/192\.168\.\d+\.\d+:3000$/, // Cualquier IP 192.168.x.x en puerto 3000
    /^http:\/\/10\.\d+\.\d+\.\d+:5173$/,   // Cualquier IP 10.x.x.x en puerto 5173
    /^http:\/\/172\.16\.\d+\.\d+:5173$/   // Cualquier IP 172.16.x.x en puerto 5173
  ],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos
connectDB();

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente!',
    version: '1.0.0'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 API disponible localmente en: http://localhost:${PORT}`);
  console.log(`🌐 API accesible desde la red en: http://0.0.0.0:${PORT}`);
  console.log(`🔗 Para acceder desde otros dispositivos usa: http://192.168.137.218:${PORT}`);
});

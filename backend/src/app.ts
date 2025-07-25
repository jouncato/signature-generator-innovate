
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import routes from './routes';
import { errorHandler } from './utils/error-handler';

// Cargar variables de entorno
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') 
    : '*'
}));
app.use(helmet()); // Seguridad HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rutas API
app.use('/api', routes);

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

export default app;

// src/config/db.config.ts
import { Pool, PoolConfig } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig: PoolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: isProduction ? { rejectUnauthorized: false } : false
};

const pool = new Pool(poolConfig);

// Evento para monitorear errores de conexión
pool.on('error', (err) => {
  console.error('Error inesperado en el cliente PostgreSQL', err);
  process.exit(-1);
});

export default pool;
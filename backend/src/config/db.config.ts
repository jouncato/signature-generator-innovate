import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secretpassword',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'firma_digital',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Remover SSL para desarrollo local
  ssl: false
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Error en PostgreSQL:', err);
});

export default pool;
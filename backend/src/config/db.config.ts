import { Pool, PoolConfig } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig: PoolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: isProduction ? { rejectUnauthorized: false } : false
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente PostgreSQL', err);
  process.exit(-1);
});

export default pool;
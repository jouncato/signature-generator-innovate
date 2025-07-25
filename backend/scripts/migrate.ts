import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME
});

const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS firmas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    telefono VARCHAR(50),
    celular VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

async function migrate(): Promise<void> {
  try {
    console.log('Iniciando migración de base de datos...');
    await pool.query(createTablesQuery);
    console.log('Migración completada exitosamente');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error en la migración:', error);
    await pool.end();
    process.exit(1);
  }
}

migrate();
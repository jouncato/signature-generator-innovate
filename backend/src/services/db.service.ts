import { QueryResult } from 'pg';
import pool from '../config/db.config';

export class DbService {
  /**
   * Ejecuta una consulta SQL con parámetros opcionales
   * @param text Texto de la consulta SQL
   * @param params Parámetros para la consulta
   * @returns Resultado de la consulta
   */
  static async query(text: string, params?: any[]): Promise<QueryResult> {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Consulta ejecutada', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Error en consulta', { text, error });
      throw error;
    }
  }

  /**
   * Ejecuta múltiples consultas en una transacción
   * @param callback Función que contiene las consultas a ejecutar
   * @returns Resultado de la transacción
   */
  static async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
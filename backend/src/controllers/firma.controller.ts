import { Request, Response, NextFunction } from 'express';
import { DbService } from '../services/db.service';
import { ImageService } from '../services/image.service';
import { Firma } from '../models/firma.model';

export class FirmaController {
  /**
   * Guarda una nueva firma en la base de datos
   */
  static async saveFirma(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const firma: Firma = req.body;
      
      // Validar datos requeridos
      if (!firma.nombre || !firma.apellido || !firma.cargo || !firma.departamento || !firma.email) {
        res.status(400).json({ error: 'Faltan campos requeridos' });
        return;
      }
      
      // Insertar en la base de datos
      const query = `
        INSERT INTO firmas (nombre, apellido, cargo, departamento, telefono, celular, email)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const values = [
        firma.nombre,
        firma.apellido,
        firma.cargo,
        firma.departamento,
        firma.telefono || null,
        firma.celular || null,
        firma.email
      ];
      
      const result = await DbService.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene todas las firmas
   */
  static async getFirmas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await DbService.query('SELECT * FROM firmas ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Genera el HTML de la firma
   */
  static async renderHtml(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const firma: Firma = req.body;
      
      // Validar datos requeridos
      if (!firma.nombre || !firma.apellido || !firma.cargo || !firma.departamento || !firma.email) {
        res.status(400).json({ error: 'Faltan campos requeridos' });
        return;
      }
      
      const html = ImageService.renderHtml(firma);
      res.send(html);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Genera una imagen de la firma
   */
  static async generateImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const firma: Firma = req.body;
      
      // Validar datos requeridos
      if (!firma.nombre || !firma.apellido || !firma.cargo || !firma.departamento || !firma.email) {
        res.status(400).json({ error: 'Faltan campos requeridos' });
        return;
      }
      
      const imageBuffer = await ImageService.generateImage(firma);
      
      // Configurar encabezados para la imagen
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename=firma-innovate.png',
        'Content-Length': imageBuffer.length
      });
      
      res.send(imageBuffer);
    } catch (error) {
      next(error);
    }
  }
}
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

export class ImageService {
  private static templatePath = path.join(__dirname, '../templates/firma.hbs');
  private static template: string;

  /**
   * Inicializa el servicio cargando la plantilla Handlebars
   */
  static initialize(): void {
    try {
      this.template = fs.readFileSync(this.templatePath, 'utf8');
    } catch (error) {
      console.error('Error al cargar la plantilla de firma:', error);
      throw error;
    }
  }

  /**
   * Renderiza el HTML de la firma con los datos proporcionados
   * @param firma Datos de la firma
   * @returns HTML renderizado
   */
  static renderHtml(firma: any): string {
    if (!this.template) {
      this.initialize();
    }
    
    const template = handlebars.compile(this.template);
    return template(firma);
  }

  /**
   * Genera una imagen a partir del HTML renderizado
   * @param firma Datos de la firma
   * @returns Buffer de la imagen generada
   */
  static async generateImage(firma: any): Promise<Buffer> {
    const html = this.renderHtml(firma);
    
    // Iniciar navegador Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Establecer viewport y contenido
      await page.setViewport({ width: 600, height: 200 });
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Identificar el elemento de la firma
      const element = await page.$('.firma-container');
      if (!element) {
        throw new Error('Elemento de firma no encontrado');
      }
      
      // Tomar captura de pantalla del elemento
      const imageBuffer = await element.screenshot({
        type: 'png',
        omitBackground: false
      });
      
      return imageBuffer;
    } finally {
      await browser.close();
    }
  }
}

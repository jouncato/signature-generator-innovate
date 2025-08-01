import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { Firma } from '../models/firma.model';

export class ImageService {
  private static templatePath = path.join(__dirname, '../templates/firma.hbs');
  private static template: string;

  static initialize(): void {
    try {
      this.template = fs.readFileSync(this.templatePath, 'utf8');
    } catch (error) {
      console.error('Error al cargar la plantilla de firma:', error);
      throw error;
    }
  }

  static renderHtml(firma: Firma): string {
    if (!this.template) {
      this.initialize();
    }
    
    const templateData = {
      ...firma,
      logoUrl: process.env.LOGO_URL || 'http://localhost:3000/assets/images/logo-innovate.png',
      phoneIconUrl: process.env.PHONE_ICON_URL || 'http://localhost:3000/assets/images/icon-phone.png',
      mobileIconUrl: process.env.MOBILE_ICON_URL || 'http://localhost:3000/assets/images/icon-mobile.png',
      emailIconUrl: process.env.EMAIL_ICON_URL || 'http://localhost:3000/assets/images/icon-email.png',
      webIconUrl: process.env.WEB_ICON_URL || 'http://localhost:3000/assets/images/icon-web.png',
      facebookIconUrl: process.env.FACEBOOK_ICON_URL || 'http://localhost:3000/assets/images/icon-facebook.png',
      instagramIconUrl: process.env.INSTAGRAM_ICON_URL || 'http://localhost:3000/assets/images/icon-instagram.png',
      linkedinIconUrl: process.env.LINKEDIN_ICON_URL || 'http://localhost:3000/assets/images/icon-linkedin.png'
    };
    
    const template = handlebars.compile(this.template);
    return template(templateData);
  }

  static async generateImage(firma: Firma): Promise<Buffer> {
    const html = this.renderHtml(firma);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 600, height: 200 });
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const element = await page.$('.firma-container');
      if (!element) {
        throw new Error('Elemento de firma no encontrado');
      }
      
      const imageBuffer = await element.screenshot({
        type: 'png',
        omitBackground: false
      });
      
      return Buffer.from(imageBuffer);
    } finally {
      await browser.close();
    }
  }
}
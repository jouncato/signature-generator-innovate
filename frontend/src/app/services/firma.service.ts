import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firma } from '../models/firma.model';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {
  private firmaSubject = new BehaviorSubject<Firma | null>(null);
  public firma$ = this.firmaSubject.asObservable();

  constructor() { }

  updateFirma(firma: Firma): void {
    this.firmaSubject.next(firma);
  }

  getCurrentFirma(): Firma | null {
    return this.firmaSubject.getValue();
  }

  generateImageLocally(elementId: string): Promise<Blob> {
    const element = document.getElementById(elementId);
    if (!element) {
      return Promise.reject('Elemento no encontrado');
    }

    return html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject('Error al convertir canvas a blob');
          }
        }, 'image/png', 1.0);
      });
    });
  }

  async downloadImage(elementId: string, fileName: string = 'firma-innovate.png'): Promise<void> {
    try {
      const blob = await this.generateImageLocally(elementId);
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error al generar la imagen:', error);
      throw error;
    }
  }

}
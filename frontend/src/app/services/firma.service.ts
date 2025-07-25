import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firma } from '../models/firma.model';
import { ApiService } from './api.service';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {
  private firmaSubject = new BehaviorSubject<Firma | null>(null);
  public firma$ = this.firmaSubject.asObservable();

  constructor(private apiService: ApiService) { }

  // Actualizar datos de firma en el servicio
  updateFirma(firma: Firma): void {
    this.firmaSubject.next(firma);
  }

  // Obtener datos actuales de firma
  getCurrentFirma(): Firma | null {
    return this.firmaSubject.getValue();
  }

  // Guardar firma en el servidor
  saveFirma(firma: Firma): Observable<Firma> {
    return this.apiService.saveFirma(firma);
  }

  // Generar imagen usando html2canvas (método en el cliente)
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
      return new Promise<Blob>((resolve) => {
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

  // Descargar imagen generada localmente
  async downloadImage(elementId: string, fileName: string = 'firma-innovate.png'): Promise<void> {
    try {
      const blob = await this.generateImageLocally(elementId);
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error al generar la imagen:', error);
      throw error;
    }
  }

  // Generar y descargar imagen desde el servidor
  generateAndDownloadImage(firma: Firma, fileName: string = 'firma-innovate.png'): void {
    this.apiService.generateImage(firma).subscribe(blob => {
      saveAs(blob, fileName);
    }, error => {
      console.error('Error al generar la imagen en el servidor:', error);
    });
  }
}

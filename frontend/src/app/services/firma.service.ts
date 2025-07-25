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

  updateFirma(firma: Firma): void {
    this.firmaSubject.next(firma);
  }

  getCurrentFirma(): Firma | null {
    return this.firmaSubject.getValue();
  }

  saveFirma(firma: Firma): Observable<Firma> {
    return this.apiService.saveFirma(firma);
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

  generateAndDownloadImage(firma: Firma, fileName: string = 'firma-innovate.png'): void {
    this.apiService.generateImage(firma).subscribe({
      next: (blob) => {
        saveAs(blob, fileName);
      },
      error: (error) => {
        console.error('Error al generar la imagen en el servidor:', error);
      }
    });
  }
}
import { Component } from '@angular/core';
import { FirmaService } from '../../services/firma.service';

@Component({
  selector: 'app-firma-download',
  templateUrl: './firma-download.component.html',
  styleUrls: ['./firma-download.component.scss']
})
export class FirmaDownloadComponent {
  downloading = false;
  error = '';

  constructor(private firmaService: FirmaService) { }

  downloadImage(): void {
    this.downloading = true;
    this.error = '';
    
    try {
      const firma = this.firmaService.getCurrentFirma();
      if (!firma) {
        this.error = 'No hay datos de firma para descargar';
        this.downloading = false;
        return;
      }
      
      // Descargar imagen generada localmente
      this.firmaService.downloadImage('firma-preview')
        .then(() => {
          this.downloading = false;
        })
        .catch(err => {
          this.error = 'Error al descargar la imagen';
          this.downloading = false;
          console.error('Error en descarga:', err);
        });
    } catch (error) {
      this.error = 'Error al descargar la imagen';
      this.downloading = false;
      console.error('Error en descarga:', error);
    }
  }

  downloadImageFromServer(): void {
    this.downloading = true;
    this.error = '';
    
    const firma = this.firmaService.getCurrentFirma();
    if (!firma) {
      this.error = 'No hay datos de firma para descargar';
      this.downloading = false;
      return;
    }
    
    try {
      // Descargar imagen generada en el servidor
      this.firmaService.generateAndDownloadImage(firma);
      this.downloading = false;
    } catch (error) {
      this.error = 'Error al descargar la imagen';
      this.downloading = false;
      console.error('Error en descarga del servidor:', error);
    }
  }
}
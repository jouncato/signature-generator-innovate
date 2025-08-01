import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirmaService } from '../../services/firma.service';

@Component({
  selector: 'app-firma-download',
  standalone: true,
  imports: [CommonModule],
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

}
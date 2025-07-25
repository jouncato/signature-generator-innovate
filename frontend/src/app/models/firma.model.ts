export interface Firma {
  id?: number;
  nombre: string;
  apellido: string;
  cargo: string;
  departamento: string;
  telefono: string;
  celular: string;
  email: string;
  createdAt?: Date;
}

// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Firma } from '../models/firma.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  // Guardar firma en la base de datos
  saveFirma(firma: Firma): Observable<Firma> {
    return this.http.post<Firma>(`${this.apiUrl}/firmas`, firma, { headers: this.headers });
  }

  // Generar imagen de la firma
  generateImage(firma: Firma): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/firmas/generate-image`, firma, {
      headers: this.headers,
      responseType: 'blob'
    });
  }

  // Obtener HTML renderizado para la firma
  getRenderedHtml(firma: Firma): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/firmas/render-html`, firma, { 
      headers: this.headers 
    });
  }
}
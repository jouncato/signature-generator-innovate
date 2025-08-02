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

  saveFirma(firma: Firma): Observable<Firma> {
    return this.http.post<Firma>(`${this.apiUrl}/firmas`, firma, { headers: this.headers });
  }

  generateImage(firma: Firma): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/firmas/generate-image`, firma, {
      headers: this.headers,
      responseType: 'blob'
    });
  }

  getRenderedHtml(firma: Firma): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/firmas/render-html`, firma, { 
      headers: this.headers 
    });
  }
}
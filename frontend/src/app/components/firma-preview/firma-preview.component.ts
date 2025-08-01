import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirmaService } from '../../services/firma.service';
import { Firma } from '../../models/firma.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-firma-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './firma-preview.component.html',
  styleUrls: ['./firma-preview.component.scss']
})
export class FirmaPreviewComponent implements OnInit {
  firma: Firma | null = null;
  assetsUrl = environment.assetsUrl;

  constructor(private firmaService: FirmaService) { }

  ngOnInit(): void {
    this.firmaService.firma$.subscribe(firma => {
      this.firma = firma;
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirmaService } from '../../services/firma.service';
import { Firma } from '../../models/firma.model';
import { FirmaPreviewComponent } from '../firma-preview/firma-preview.component';
import { FirmaDownloadComponent } from '../firma-download/firma-download.component';

@Component({
  selector: 'app-firma-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FirmaPreviewComponent, FirmaDownloadComponent],
  templateUrl: './firma-form.component.html',
  styleUrls: ['./firma-form.component.scss']
})
export class FirmaFormComponent implements OnInit {
  firmaForm!: FormGroup;
  submitted = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private firmaService: FirmaService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.firmaForm.valueChanges.subscribe(formValue => {
      this.firmaService.updateFirma(formValue);
    });
  }

  initForm(): void {
    this.firmaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.maxLength(50)]],
      cargo: ['', [Validators.required, Validators.maxLength(100)]],
      departamento: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.pattern('^[0-9+ -]*$')]],
      celular: ['', [Validators.pattern('^[0-9+ -]*$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.firmaForm.invalid) {
      return;
    }
    
    this.loading = true;
    const firma: Firma = this.firmaForm.value;
    
    try {
      this.firmaService.updateFirma(firma);
      this.loading = false;
      this.error = '';
    } catch (error) {
      this.loading = false;
      this.error = 'Error al procesar la firma. Por favor, intente de nuevo.';
      console.error('Error al procesar firma:', error);
    }
  }

  get f() { return this.firmaForm.controls; }
}
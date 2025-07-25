import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirmaService } from '../../services/firma.service';
import { Firma } from '../../models/firma.model';

@Component({
  selector: 'app-firma-form',
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
    
    // Actualizar la vista previa en tiempo real con cada cambio
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
    
    this.firmaService.saveFirma(firma).subscribe(
      response => {
        this.loading = false;
        this.error = '';
        // Propagar el ID generado en el servidor
        this.firmaForm.patchValue({ id: response.id });
        this.firmaService.updateFirma(this.firmaForm.value);
      },
      error => {
        this.loading = false;
        this.error = 'Error al guardar la firma. Por favor, intente de nuevo.';
        console.error('Error al guardar firma:', error);
      }
    );
  }

  // Métodos getter para acceso fácil a los campos del formulario
  get f() { return this.firmaForm.controls; }
}

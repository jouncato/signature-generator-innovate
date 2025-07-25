import { Routes } from '@angular/router';
import { FirmaFormComponent } from './components/firma-form/firma-form.component';

export const routes: Routes = [
  { path: '', component: FirmaFormComponent },
  { path: '**', redirectTo: '' }
];
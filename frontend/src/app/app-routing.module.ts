import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirmaFormComponent } from './components/firma-form/firma-form.component';

const routes: Routes = [
  { path: '', component: FirmaFormComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
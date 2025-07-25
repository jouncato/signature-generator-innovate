import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirmaFormComponent } from './components/firma-form/firma-form.component';
import { FirmaPreviewComponent } from './components/firma-preview/firma-preview.component';
import { FirmaDownloadComponent } from './components/firma-download/firma-download.component';

@NgModule({
  declarations: [
    AppComponent,
    FirmaFormComponent,
    FirmaPreviewComponent,
    FirmaDownloadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container">
      <header>
        <h1>Generador de Firma Digital - Innovate Nutrition</h1>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <footer>
        <p>&copy; 2025 Innovate Nutrition. Todos los derechos reservados.</p>
      </footer>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      margin-bottom: 30px;
      text-align: center;
    }
    footer {
      margin-top: 50px;
      text-align: center;
      color: #666;
    }
  `]
})
export class AppComponent {
  title = 'firma-digital';
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderService } from './preloader.service';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preloader" [class.active]="loader.active()">
      <img src="/logo.webp" alt="Cargando…" class="spinner" />
    </div>
  `,
  styleUrls: ['./preloader.css'],
})
export class PreloaderComponent {
  loader = inject(PreloaderService);
}

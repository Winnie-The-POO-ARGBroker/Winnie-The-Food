// src/app/app.ts
import { Component, inject, signal, ApplicationRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Menu } from './shared/components/menu/menu';
import { Footer } from './shared/components/footer/footer';
import { PreloaderComponent } from './shared/preloader/preloader';
import { PreloaderService } from './shared/preloader/preloader.service';
import { RouteLoaderService } from './core/route-loader.service';
import { filter, take } from 'rxjs/operators';
import { fromEvent, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, PreloaderComponent, Menu, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('myapp');

  private appRef = inject(ApplicationRef);
  loader = inject(PreloaderService);

  // ⚠️ esto inicializa la suscripción global del Router
  private _routeLoader = inject(RouteLoaderService);

  async ngOnInit() {
    // Loader de primer paint (app estable + window load + imágenes del primer render)
    await Promise.all([
      firstValueFrom(this.appRef.isStable.pipe(filter(Boolean), take(1))),
      firstValueFrom(fromEvent(window, 'load').pipe(take(1))),
    ]);
    await this.loader.waitForImages(document);
    this.loader.hide();
  }
}

import { Component, inject, signal, ApplicationRef } from '@angular/core';
import {
  RouterOutlet, Router,
  NavigationStart, NavigationEnd, NavigationCancel, NavigationError
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { Menu } from './shared/components/menu/menu';
import { Footer } from './shared/components/footer/footer';

import { PreloaderComponent } from './shared/preloader/preloader';
import { PreloaderService } from './shared/preloader/preloader.service';

import { filter, take } from 'rxjs/operators';
import { fromEvent, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    PreloaderComponent,
    Menu, Footer,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('myapp');

  private router = inject(Router);
  private appRef = inject(ApplicationRef);
  private loader = inject(PreloaderService);

  async ngOnInit() {
    // 1) Loader inicial: Angular estable + window 'load' + imágenes del primer render
    await Promise.all([
      firstValueFrom(this.appRef.isStable.pipe(filter(Boolean), take(1))),
      firstValueFrom(fromEvent(window, 'load').pipe(take(1))),
    ]);
    await this.loader.waitForImages(document);   // 👈 medimos en document
    this.loader.hide();

    // 2) Loader en cada navegación
    this.router.events
      .pipe(filter(e =>
        e instanceof NavigationStart ||
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      ))
      .subscribe(async e => {
        if (e instanceof NavigationStart) {
          this.loader.show();
          return;
        }
        // Fin de navegación (ok/cancel/error): esperar un tick y revisar imágenes del nuevo DOM
        await new Promise(r => setTimeout(r, 0));
        await this.loader.waitForImages(document); // 👈 medimos en document
        this.loader.hide();
      });
  }
}

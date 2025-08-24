import { Component, ElementRef, ViewChild, inject, signal, ApplicationRef } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
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

  @ViewChild(RouterOutlet, { read: ElementRef }) outlet?: ElementRef;

  async ngOnInit() {
    // 1) Mostrar loader inicial hasta que Angular esté estable + window 'load' + imágenes listas
    await Promise.all([
      firstValueFrom(this.appRef.isStable.pipe(filter(Boolean), take(1))),
      firstValueFrom(fromEvent(window, 'load').pipe(take(1))),
    ]);
    await this.loader.waitForImages();   // imágenes del primer render
    this.loader.hide();

    // 2) Loader en cada navegación (mientras pinta el nuevo route e imágenes)
    this.router.events
      .pipe(filter(e =>
        e instanceof NavigationStart ||
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError))
      .subscribe(async e => {
        if (e instanceof NavigationStart) {
          this.loader.show();
          return;
        }
        // Fin de navegación: esperar un tick para que el DOM del nuevo route exista
        await new Promise(r => setTimeout(r, 0));
        await this.loader.waitForImages(this.outlet?.nativeElement ?? document);
        this.loader.hide();
      });
  }
}

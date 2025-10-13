import { Injectable, inject } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs';
import { PreloaderService } from '../shared/preloader/preloader.service';

@Injectable({ providedIn: 'root' })
export class RouteLoaderService {
  private router = inject(Router);
  private loader = inject(PreloaderService);

  constructor() {
    this.router.events.pipe(
      filter(e =>
        e instanceof NavigationStart ||
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      )
    ).subscribe(e => {
      if (e instanceof NavigationStart) this.loader.routeStart();
      else this.loader.routeEnd();
    });
  }
}

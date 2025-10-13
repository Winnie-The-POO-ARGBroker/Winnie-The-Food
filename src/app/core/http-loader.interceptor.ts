import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { PreloaderService } from '../shared/preloader/preloader.service';

export const httpLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(PreloaderService);
  loader.httpStart();
  return next(req).pipe(finalize(() => loader.httpEnd()));
};

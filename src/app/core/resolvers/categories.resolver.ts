import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { firstValueFrom } from 'rxjs';

export const categoriesResolver: ResolveFn<any[]> = async () => {
  const svc = inject(RecipesService);
  return await firstValueFrom(svc.getCategorias());
};

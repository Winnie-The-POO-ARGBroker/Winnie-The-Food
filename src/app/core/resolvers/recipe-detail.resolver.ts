import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { firstValueFrom } from 'rxjs';

export const recipeDetailResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  const router = inject(Router);
  const svc = inject(RecipesService);

  if (!id) {
    router.navigateByUrl('/');
    return null;
  }

  try {
    return await firstValueFrom(svc.getRecetaById(id));
  } catch {
    router.navigateByUrl('/');
    return null;
  }
};

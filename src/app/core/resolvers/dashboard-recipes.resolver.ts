import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';
import { toFeaturedCard } from '../../recipes/mappers';
import type { FeaturedCard } from '../../shared/components/featured/featured';

export const myRecipesResolver: ResolveFn<FeaturedCard[]> = () => {
  const api  = inject(RecipesService);
  const auth = inject(AuthService);

  const isAdmin = auth.role().toLowerCase() === 'admin';
  const req$ = isAdmin ? api.getRecetas() : api.getRecetasByAutor(auth.currentUser()?.id ?? 0);

  return req$.pipe(
    map(list => list.map(toFeaturedCard))
  );
};

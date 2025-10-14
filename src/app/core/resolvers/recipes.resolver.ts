import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { map } from 'rxjs/operators';
import { toFeaturedCard } from '../../recipes/mappers';
import type { FeaturedCard } from '../../shared/components/featured/featured';

// Detecta si YA es un FeaturedCard
function isFeaturedCard(x: any): x is FeaturedCard {
  return !!x && typeof x === 'object' && 'titulo' in x && 'enlace' in x;
}

export const allRecipesResolver: ResolveFn<FeaturedCard[]> = (route: ActivatedRouteSnapshot) => {
  const api = inject(RecipesService);
  const cat = route.queryParamMap.get('categoria');

  const req$ = cat ? api.getFeaturedCardsByCategoria(cat) : api.getFeaturedCards();

  return req$.pipe(
    map((list: any[]) =>
      list.map(item => (isFeaturedCard(item) ? item : toFeaturedCard(item as any)))
    )
  );
};

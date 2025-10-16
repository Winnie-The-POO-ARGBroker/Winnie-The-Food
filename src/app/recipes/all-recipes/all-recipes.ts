import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Featured } from '../../shared/components/featured/featured';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import type { FeaturedCard } from '../../shared/components/featured/featured';
import { PreloaderService } from '../../shared/preloader/preloader.service';

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [Featured, EmptyState],
  templateUrl: './all-recipes.html',
  styleUrl: './all-recipes.css',
})
export class AllRecipes {
  private route  = inject(ActivatedRoute);
  private loader = inject(PreloaderService);

  featuredRecipesArray = signal<FeaturedCard[]>([]);
  errorMsg = signal('');

  constructor() {
    this.route.data.subscribe(async (d) => {
      const cards = (d['recetas'] as FeaturedCard[] | undefined) ?? [];
      this.featuredRecipesArray.set(cards);
      this.errorMsg.set(cards.length ? '' : 'No se pudieron cargar las recetas.');

      await queueMicrotask(() => {});
      if (this.loader.pendingHttp === 0) this.loader.hide();
    });
  }

  limpiarFiltro() { location.href = '/all-recipes'; }
}

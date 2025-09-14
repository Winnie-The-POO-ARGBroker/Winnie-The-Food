import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Featured } from '../../shared/components/featured/featured';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { RecipesService, FeaturedCard } from '../../services/recipes.service';

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [Featured, EmptyState, HttpClientModule, RouterLink],
  templateUrl: './all-recipes.html',
  styleUrl: './all-recipes.css'
})
export class AllRecipes implements OnInit {
  private recipeService = inject(RecipesService);
  private route = inject(ActivatedRoute);

  featuredRecipesArray: FeaturedCard[] = [];
  loading = false;
  errorMsg = '';
  categoriaActual: string | null = null;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.categoriaActual = params.get('categoria');
      this.cargar();
    });
  }

  private cargar() {
    this.loading = true;
    this.errorMsg = '';
    const req$ = this.categoriaActual
      ? this.recipeService.getFeaturedCardsByCategoria(this.categoriaActual)
      : this.recipeService.getFeaturedCards();

    req$.subscribe({
      next: (cards) => { this.featuredRecipesArray = cards; this.loading = false; },
      error: (err) => { console.error(err); this.errorMsg = err?.message ?? 'No se pudieron cargar las recetas.'; this.loading = false; }
    });
  }

  limpiarFiltro() {
    location.href = '/all-recipes';
  }
}

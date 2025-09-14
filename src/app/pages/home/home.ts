import { Component, OnInit, inject } from '@angular/core';
import { RecipesService, FeaturedCard } from '../../services/recipes.service';
import { Categoria } from '../../models/catergories-models';

import { Featured } from '../../shared/components/featured/featured';
import { Categories } from '../../shared/components/categories/categories';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Featured, Categories],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private recipesService = inject(RecipesService);

  categoriesArray: Categoria[] = [];
  featuredRecipesArray: FeaturedCard[] = [];

  loadingCats = false;
  loadingFeat = false;
  errorCats = '';
  errorFeat = '';

  ngOnInit(): void {
    this.loadingCats = true;
    this.loadingFeat = true;

    this.recipesService.getCategorias().subscribe({
      next: (cats) => { this.categoriesArray = cats; this.loadingCats = false; },
      error: (e) => { console.error(e); this.errorCats = 'No se pudieron cargar las categorÃas.'; this.loadingCats = false; }
    });

    this.recipesService.getFeaturedCardsLatest(3).subscribe({
      next: (cards) => { this.featuredRecipesArray = cards; this.loadingFeat = false; },
      error: (e) => { console.error(e); this.errorFeat = 'No se pudieron cargar las recetas destacadas.'; this.loadingFeat = false; }
    });
  }
}
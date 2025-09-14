import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { switchMap, map, filter } from 'rxjs';

import { RecipesService } from '../../services/recipes.service';
import { Receta } from '../../models/receta-model';
import { Featured } from '../../shared/components/featured/featured';

import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-detail-recipe',
  standalone: true,
  imports: [TitleCasePipe, Featured, EmptyState],
  templateUrl: './detail-recipe.html',
  styleUrl: './detail-recipe.css'
})
export class DetailRecipe {
  private route = inject(ActivatedRoute);
  private recipes = inject(RecipesService);

  loading = signal(true);
  errorMsg = signal('');
  receta = signal<Receta | null>(null);

  totalTime = computed(() => {
    const r = this.receta();
    if (!r) return '—';
    const total = (r.tiempoPrep ?? 0) + (r.tiempoCoc ?? 0);
    return total > 0 ? `${total} min` : '—';
  });

  relatedForFeatured = computed(() => {
    const r = this.receta();
    if (!r) return [];
    return (r.related ?? []).map(rel => ({
      id: undefined,
      titulo: rel.titulo,
      descripcion: rel.descripcion,
      imagen: rel.imagen,
      enlace: '#',
      tiempo: rel.tiempo,
      dificultad: rel.dificultad
    }));
  });

  constructor() {
    this.route.paramMap.pipe(
      map(p => Number(p.get('id'))),
      filter(id => !!id),
      switchMap(id => this.recipes.getById(id))
    ).subscribe({
      next: rec => { this.receta.set(rec); this.loading.set(false); },
      error: err => { console.error(err); this.errorMsg.set('No se pudo cargar la receta.'); this.loading.set(false); }
    });
  }

  onAddToFavorites(): void {
    console.log('Favorito:', this.receta()?.id);
  }
}
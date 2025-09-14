import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
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
  errorMsg = signal<string | null>(null);
  receta   = signal<Receta | null>(null);

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) { this.errorMsg.set('ID de receta inválido'); this.loading.set(false); return; }
      this.loading.set(true); this.errorMsg.set(null);
      this.recipes.getRecetaById(String(id)).subscribe({
        next: r => { this.receta.set(r); this.loading.set(false); },
        error: e => { this.errorMsg.set(e?.message || 'Receta no encontrada'); this.loading.set(false); }
      });
    });
  }

  totalTime = computed(() => {
    const r = this.receta(); if (!r) return '—';
    const tot = (r.tiempoPrep ?? 0) + (r.tiempoCoc ?? 0);
    return tot > 0 ? `${tot} min` : '—';
  });

  relatedForFeatured() {
    const r = this.receta(); if (!r) return [];
    return (r.related ?? []).map(x => ({
      titulo: x.titulo,
      descripcion: x.descripcion,
      imagen: x.imagen,
      enlace: x.enlace ?? '#',
      tiempo: x.tiempo,
      dificultad: x.dificultad as 'facil'|'medio'|'dificil'
    }));
  }

  onAddToFavorites() { alert('¡Agregado a favoritos!'); }
}

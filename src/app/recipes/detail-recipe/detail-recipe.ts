import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { Receta } from '../../models/receta-model';
import { Featured, FeaturedCard } from '../../shared/components/featured/featured';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { PreloaderService } from '../../shared/preloader/preloader.service';

@Component({
  selector: 'app-detail-recipe',
  standalone: true,
  imports: [TitleCasePipe, Featured, EmptyState],
  templateUrl: './detail-recipe.html',
  styleUrl: './detail-recipe.css'
})
export class DetailRecipe {
  private route  = inject(ActivatedRoute);
  private loader = inject(PreloaderService);

  errorMsg = signal<string | null>(null);
  receta   = signal<Receta | null>(null);

  constructor() {
    const r = this.route.snapshot.data['receta'] as Receta | null | undefined;
    if (!r) {
      this.errorMsg.set('Receta no encontrada');
    } else {
      this.receta.set(r);
    }

    queueMicrotask(async () => {
      await this.loader.waitForImages(document);
      if (this.loader.pendingHttp === 0) this.loader.hide();
    });
  }

  totalTime = computed(() => {
    const r = this.receta(); if (!r) return '—';
    const tot = (r.tiempoPrep ?? 0) + (r.tiempoCoc ?? 0);
    return tot > 0 ? `${tot} min` : '—';
  });

  dificultadStr(): 'facil'|'medio'|'dificil' {
    const v = String(this.receta()?.dificultad ?? '').toLowerCase();
    if (v === '1' || v === 'facil') return 'facil';
    if (v === '2' || v === 'medio') return 'medio';
    return 'dificil';
  }

  relatedForFeatured(): FeaturedCard[] {
    const r = this.receta(); if (!r) return [];
    return (r.related ?? []).map((x: any, i: number): FeaturedCard => {
      const xid = String(x?.id ?? i);
      const difVal = String(x?.dificultad ?? '').toLowerCase();
      const dificultad: FeaturedCard['dificultad'] =
        difVal === '1' || difVal === 'facil' ? 'facil'
      : difVal === '2' || difVal === 'medio' || difVal === 'media' ? 'medio'
      : 'dificil';

      const imagen = (() => {
        const src = (x?.imagen ?? x?.imageUrl ?? '').toString().trim();
        return src && src !== 'null' && src !== 'undefined' ? src : null;
      })();

      return {
        id: xid,
        titulo: String(x?.titulo ?? ''),
        descripcion: String(x?.descripcion ?? ''),
        imagen,
        enlace: typeof x?.enlace === 'string' && x.enlace.trim() ? x.enlace : `/detail-recipe/${xid}`,
        tiempo: String(x?.tiempo ?? '—'),
        dificultad
      };
    });
  }

  onAddToFavorites() { alert('¡Agregado a favoritos!'); }
}

import { Component, inject, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Featured, FeaturedCard } from '../../shared/components/featured/featured';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { PreloaderService } from '../../shared/preloader/preloader.service';
import { AuthService } from '../../services/auth.service';
import { RecipesService } from '../../services/recipes.service';

@Component({
  selector: 'app-dashboard-recipes',
  standalone: true,
  imports: [Featured, EmptyState],
  templateUrl: './dashboard-recipes.html',
  styleUrl: './dashboard-recipes.css'
})
export class DashboardRecipes {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private loader = inject(PreloaderService);
  private api    = inject(RecipesService);
  private auth   = inject(AuthService);

  errorMsg = signal('');
  cards    = signal<FeaturedCard[]>([]);
  isAdmin  = computed(() => this.auth.role().toLowerCase() === 'admin');

  constructor() {
    this.route.data.subscribe(async (d) => {
      const cards = (d['recetas'] as FeaturedCard[] | undefined) ?? [];
      this.cards.set(cards);
      this.errorMsg.set(cards.length ? '' : 'No se pudieron cargar tus recetas.');

      await queueMicrotask(() => {});
      if (this.loader.pendingHttp === 0) this.loader.hide();
    });
  }

  crear()  { this.router.navigate(['/new-recipe']); }
  editar(id?: string | number) {
    if (id == null) return;
    this.router.navigate(['/new-recipe'], { queryParams: { edit: String(id) } });
  }
  eliminar(id?: string | number) {
    if (id == null) return;
    if (!confirm('¿Eliminar esta receta?')) return;

    const sid = String(id);
    this.api.deleteReceta(sid).subscribe({
      next: () => this.cards.update(arr => arr.filter(c => String(c.id) !== sid)),
      error: e => { console.error(e); alert('No se pudo eliminar la receta.'); }
    });
  }
}

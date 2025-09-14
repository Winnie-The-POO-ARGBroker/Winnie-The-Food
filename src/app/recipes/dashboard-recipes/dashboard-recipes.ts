import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { Receta } from '../../models/receta-model';
import { AuthService } from '../../services/auth.service';
import { Featured, FeaturedCard } from '../../shared/components/featured/featured';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-dashboard-recipes',
  standalone: true,
  imports: [RouterLink, Featured, EmptyState],
  templateUrl: './dashboard-recipes.html',
  styleUrl: './dashboard-recipes.css'
})
export class DashboardRecipes {
  private recipes = inject(RecipesService);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(true);
  errorMsg = signal('');
  cards = signal<FeaturedCard[]>([]);

  isAdmin = computed(() => this.auth.role().toLowerCase() === 'admin');
  userId  = computed(() => this.auth.currentUser()?.id ?? 0);

  constructor() { this.load(); }

  private toCard(r: Receta): FeaturedCard {
    return {
      id: String(r.id), // id como string para poder manejar 'ls-...'
      titulo: r.nombre,
      descripcion: r.descripcion,
      imagen: r.imageUrl,
      enlace: `/detail-recipe/${r.id}`,
      tiempo: `${(r.tiempoPrep ?? 0) + (r.tiempoCoc ?? 0)} min`,
      dificultad: r.dificultad
    };
  }

  load() {
    this.loading.set(true);
    this.errorMsg.set('');

    const req$ = this.isAdmin()
      ? this.recipes.getRecetasAllSorted()
      : this.recipes.getRecetasByAutor(this.userId());

    req$.subscribe({
      next: list => { this.cards.set(list.map(r => this.toCard(r))); this.loading.set(false); },
      error: e => { console.error(e); this.errorMsg.set('No se pudieron cargar tus recetas.'); this.loading.set(false); }
    });
  }

  editar(id?: string | number) {
    if (id == null) return;
    this.router.navigate(['/new-recipe'], { queryParams: { edit: String(id) } });
  }

  eliminar(id?: string | number) {
    if (id == null) return;
    if (!confirm('¿Eliminar esta receta?')) return;

    const sid = String(id); // <- convertir a string
    this.recipes.deleteReceta(sid).subscribe({
      next: () => this.cards.update(arr => arr.filter(c => String(c.id) !== sid)),
      error: e => { console.error(e); alert('No se pudo eliminar la receta.'); }
    });
  }
}

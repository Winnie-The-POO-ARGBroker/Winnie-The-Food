import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { Receta } from '../models/receta-model';
import { Categoria } from '../models/categories-models';

export interface FeaturedCard {
  titulo: string;
  descripcion: string;
  imagen: string;
  enlace: string;
  tiempo: string;
  dificultad: 'facil' | 'medio' | 'dificil';
}

@Injectable({ providedIn: 'root' })
export class RecipesService {
  private readonly base = 'http://localhost:3001';
  private readonly LOCAL_KEY = 'recipes_local';

  constructor(private http: HttpClient) {}

  // ------- LocalStorage -------
  private readLocal(): Receta[] {
    const raw = localStorage.getItem(this.LOCAL_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw) as Receta[]; } catch { return []; }
  }
  private getLocalById(id: string): Receta | null {
    return this.readLocal().find(r => String(r.id) === String(id)) ?? null;
  }
  /** Guarda en LS (respaldo/offline) */
  saveLocal(receta: Receta) {
    const arr = this.readLocal();
    arr.unshift(receta);
    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(arr));
  }

  // ------- errores & mapping -------
  private friendly(err: unknown, fallback = 'Ocurrió un error. Intenta nuevamente.') {
    if (err instanceof Error && err.message) return err.message;
    if (err && typeof err === 'object' && 'status' in err) {
      const http = err as HttpErrorResponse;
      if (http.status === 0) return 'No hay conexión con el servidor.';
      if (http.status >= 500) return 'Servidor no disponible. Intentá más tarde.';
    }
    return fallback;
  }
  private handleError<T>(fallbackMsg: string) {
    return (err: unknown) => throwError(() => new Error(this.friendly(err, fallbackMsg)));
  }
  private calcTiempo(prep?: number, coc?: number): string {
    const total = (prep ?? 0) + (coc ?? 0);
    return total > 0 ? `${total} min` : '—';
  }
  private toCard(r: Receta): FeaturedCard {
    return {
      titulo: r.nombre,
      descripcion: r.descripcion,
      imagen: r.imageUrl,
      enlace: `/detail-recipe/${r.id}`,
      tiempo: this.calcTiempo(r.tiempoPrep, r.tiempoCoc),
      dificultad: r.dificultad as 'facil'|'medio'|'dificil'
    };
  }

  // ------- recetas (server) -------
  getRecetas(): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.base}/recetas`)
      .pipe(catchError(this.handleError<Receta[]>('No se pudieron cargar las recetas.')));
  }

  getRecetasAllSorted(): Observable<Receta[]> {
    const params = new HttpParams().set('_sort', 'id').set('_order', 'desc');
    return this.http.get<Receta[]>(`${this.base}/recetas`, { params })
      .pipe(catchError(this.handleError<Receta[]>('No se pudieron cargar las recetas.')));
  }

  getRecetasByAutor(autorId: number): Observable<Receta[]> {
    const params = new HttpParams().set('autor_id', String(autorId)).set('_sort', 'id').set('_order', 'desc');
    return this.http.get<Receta[]>(`${this.base}/recetas`, { params })
      .pipe(catchError(this.handleError<Receta[]>('No se pudieron cargar tus recetas.')));
  }

  getRecetasByCategoria(categoria: string): Observable<Receta[]> {
    const params = new HttpParams().set('categoria', categoria);
    return this.http.get<Receta[]>(`${this.base}/recetas`, { params })
      .pipe(catchError(this.handleError<Receta[]>('No se pudieron cargar las recetas de la categoría.')));
  }

  /** Crea receta en el server. Dejá que json-server asigne el id numérico. */
  createReceta(payload: Omit<Receta, 'id'>): Observable<Receta> {
    return this.http.post<Receta>(`${this.base}/recetas`, payload)
      .pipe(catchError(this.handleError<Receta>('No se pudo crear la receta.')));
  }

  // ------- GET por id (local o server) -------
  getRecetaById(id: string): Observable<Receta> {
    if (String(id).startsWith('ls-')) {
      const local = this.getLocalById(String(id));
      if (local) return of(local);
      return throwError(() => new Error('Receta local no encontrada'));
    }
    return this.http.get<Receta>(`${this.base}/recetas/${id}`).pipe(
      catchError(() => {
        const params = new HttpParams().set('id', String(id));
        return this.http.get<Receta[]>(`${this.base}/recetas`, { params }).pipe(
          map(arr => {
            if (!arr || !arr.length) throw new Error('Receta no encontrada');
            return arr[0];
          })
        );
      })
    );
  }

  getRecetasMerged(): Observable<Receta[]> {
    const local = this.readLocal();
    return this.getRecetas().pipe(map(server => [...local, ...server]));
  }

  deleteReceta(id: string): Observable<void> {
    if (String(id).startsWith('ls-')) {
      const arr = this.readLocal().filter(r => String(r.id) !== String(id));
      localStorage.setItem(this.LOCAL_KEY, JSON.stringify(arr));
      return of(void 0);
    }
    return this.http.delete<void>(`${this.base}/recetas/${id}`)
      .pipe(catchError(this.handleError<void>('No se pudo eliminar la receta.')));
  }

  // ------- featured -------
  getFeaturedCards() { return this.getRecetasMerged().pipe(map(rs => rs.map(r => this.toCard(r)))); }
  getFeaturedCardsByCategoria(c: string) { return this.getRecetasByCategoria(c).pipe(map(rs => rs.map(r => this.toCard(r)))); }
  getFeaturedCardsLatest(limit = 3) {
    return this.getRecetasMerged().pipe(
      map(rs => rs
        .sort((a, b) => String(b.id).localeCompare(String(a.id)))
        .slice(0, limit)
        .map(r => this.toCard(r))
      ),
      catchError(this.handleError('No se pudieron cargar las destacadas.'))
    );
  }

  // ------- categorías -------
  getCategorias() {
    return this.http.get<any[]>(`${this.base}/categorias`).pipe(
      map(cats => cats.map(c => {
        const nombre: string = c.nombre;
        const slug = nombre.toLowerCase().replace(/\s+/g, '-');
        return {
          id: c.id,
          nombre,
          imagen: c.imagen ?? `/assets/categorias/${slug}.webp`,
          enlace: c.enlace ?? `/all-recipes?categoria=${encodeURIComponent(nombre)}`
        } as Categoria;
      })),
      catchError(this.handleError<Categoria[]>('No se pudieron cargar las categorías.'))
    );
  }
}

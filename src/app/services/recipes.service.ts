import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

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

  constructor(private http: HttpClient) {}


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

  private toCard(r: Receta): FeaturedCard {
    return {
      titulo: r.nombre,
      descripcion: r.descripcion,
      imagen: r.imageUrl,
      enlace: `/detail-recipe/${r.id}`,
      tiempo: this.calcTiempo(r.tiempoPrep, r.tiempoCoc),
      dificultad: r.dificultad
    };
  }

  private calcTiempo(prep?: number, coc?: number): string {
    const total = (prep ?? 0) + (coc ?? 0);
    return total > 0 ? `${total} min` : '—';
  }

  // ---------- recetas ----------
  getRecetas(): Observable<Receta[]> {
    return this.http
      .get<Receta[]>(`${this.base}/recetas`)
      .pipe(catchError(this.handleError<Receta[]>('No se pudieron cargar las recetas.')));
  }

  getRecetasAllSorted(): Observable<Receta[]> {
    const params = new HttpParams().set('_sort', 'id').set('_order', 'desc');
    return this.http
      .get<Receta[]>(`${this.base}/recetas`, { params })
      .pipe(catchError(this.handleError<Receta[]>('No se pudieron cargar las recetas.')));
  }

  getRecetasByAutor(autorId: number): Observable<Receta[]> {
    const params = new HttpParams()
      .set('autor_id', String(autorId))
      .set('_sort', 'id')
      .set('_order', 'desc');
    return this.http
      .get<Receta[]>(`${this.base}/recetas`, { params })
      .pipe(catchError(this.handleError<Receta[]>('No se pudieron cargar tus recetas.')));
  }

  getRecetasByCategoria(categoria: string): Observable<Receta[]> {
    const params = new HttpParams().set('categoria', categoria);
    return this.http
      .get<Receta[]>(`${this.base}/recetas`, { params })
      .pipe(catchError(this.handleError<Receta[]>('No se pudieron cargar las recetas de la categoría.')));
  }

  getRecetaById(id: number): Observable<Receta> {
    return this.http
      .get<Receta>(`${this.base}/recetas/${id}`)
      .pipe(catchError(this.handleError<Receta>('No se pudo cargar la receta.')));
  }


  getById(id: number): Observable<Receta> {
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

  deleteReceta(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/recetas/${id}`)
      .pipe(catchError(this.handleError<void>('No se pudo eliminar la receta.')));
  }

  // ---------- featured ----------
  getFeaturedCards(): Observable<FeaturedCard[]> {
    return this.getRecetas().pipe(map(rs => rs.map(r => this.toCard(r))));
  }

  getFeaturedCardsByCategoria(categoria: string): Observable<FeaturedCard[]> {
    return this.getRecetasByCategoria(categoria).pipe(map(rs => rs.map(r => this.toCard(r))));
  }

  // últimas N por id desc
  getFeaturedCardsLatest(limit = 3): Observable<FeaturedCard[]> {
    const url = `${this.base}/recetas?_sort=id&_order=desc&_limit=${limit}`;
    return this.http.get<Receta[]>(url).pipe(
      map(rs => rs.map(r => this.toCard(r))),
      catchError(this.handleError<FeaturedCard[]>('No se pudieron cargar las destacadas.'))
    );
  }

  // ---------- categorías ----------
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<any[]>(`${this.base}/categorias`).pipe(
      map(cats =>
        cats.map(c => {
          const nombre: string = c.nombre;
          const slug = nombre.toLowerCase().replace(/\s+/g, '-');
          return {
            id: c.id,
            nombre,
            imagen: c.imagen ?? `/assets/categorias/${slug}.webp`,
            enlace: c.enlace ?? `/all-recipes?categoria=${encodeURIComponent(nombre)}`
          } as Categoria;
        })
      ),
      catchError(this.handleError<Categoria[]>('No se pudieron cargar las categorías.'))
    );
  }
}

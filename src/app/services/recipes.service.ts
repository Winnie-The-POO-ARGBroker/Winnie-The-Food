import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../models/categories-models';
import { Receta } from '../models/receta-model';

export type Dificultad = 'facil' | 'medio' | 'dificil';

export interface RecetaDTO {
  id: number;
  autor_id: string;
  nombre: string;
  descripcion?: string | null;
  porciones?: number | null;
  tiempoPrep?: number | null;
  tiempoCoc?: number | null;
  categoria?: number | null;
  dificultad?: number | null;
  tipo?: number | null;
  publicada: boolean;
  imageUrl?: string | null;
  enlace?: string | null;
  creado_en?: string;
}

export interface RecetaDetailDTO extends RecetaDTO {
  ingredients?: Array<{ orden: number; texto: string }>;
  steps?: Array<{ orden: number; texto: string }>;
  tips?: Array<{ orden: number; texto: string }>;
  nutrition?: Array<{ label: string; valueNum: number | null }>;
  related?: Array<{ titulo: string; descripcion?: string | null; tiempo?: string | null; dificultad?: string | number | null; imagen?: string | null; enlace?: string | null }>;
  tags?: string[];
}

export interface CategoriaDTO {
  id: number;
  nombre: string;
  imagen?: string | null;
}

export interface FeaturedCard {
  id?: string | number;
  titulo: string;
  descripcion: string;
  imagen: string;
  enlace: string;
  tiempo: string;
  dificultad: Dificultad;
}

@Injectable({ providedIn: 'root' })
export class RecipesService {
  private http = inject(HttpClient);
  private readonly base = environment.apiBase.replace(/\/+$/, '');

  // ---------- helpers ----------
  private difToStr(d: number | string | null | undefined): Dificultad {
    const s = String(d ?? '').toLowerCase();
    if (s === '1' || s === 'facil') return 'facil';
    if (s === '2' || s === 'medio' || s === 'media') return 'medio';
    return 'dificil';
  }
  private difToId(d: string | number | null | undefined): 1|2|3 {
    const s = String(d ?? '').toLowerCase();
    if (s === '1' || s === 'facil') return 1;
    if (s === '2' || s === 'medio' || s === 'media') return 2;
    return 3;
  }
  private catToId(c: string | number | null | undefined): number | null {
    if (c == null || c === '') return null;
    const n = Number(c);
    return Number.isFinite(n) ? n : null;
  }
  private totalMin(prep?: number | null, coc?: number | null) {
    const t = (prep ?? 0) + (coc ?? 0);
    return t > 0 ? `${t} min` : '—';
  }
  private httpFail<T>(label: string) {
    return (err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        console.error(`[${label}] HTTP ${err.status}`, err.error ?? err.message);
      } else {
        console.error(`[${label}]`, err);
      }
      const msg = err instanceof HttpErrorResponse
        ? (typeof err.error === 'string'
            ? err.error
            : (err.error?.detail || JSON.stringify(err.error) || 'Error del servidor.'))
        : 'Error desconocido.';
      return throwError(() => new Error(msg || `No se pudo completar la operación (${label}).`));
    };
  }
  private toCard(r: RecetaDTO | RecetaDetailDTO): FeaturedCard {
    return {
      id: r.id,
      titulo: r.nombre,
      descripcion: r.descripcion ?? '',
      imagen: r.imageUrl || '/assets/placeholder.webp',
      enlace: `/detail-recipe/${r.id}`,
      tiempo: this.totalMin(r.tiempoPrep, r.tiempoCoc),
      dificultad: this.difToStr(r.dificultad as any)
    };
  }
  private toReceta(r: RecetaDetailDTO): Receta {
    return {
      id: r.id,
      autor_id: r.autor_id,
      nombre: r.nombre,
      descripcion: r.descripcion ?? '',
      porciones: r.porciones ?? null,
      tiempoPrep: r.tiempoPrep ?? null,
      tiempoCoc: r.tiempoCoc ?? null,
      categoria: r.categoria ?? null,
      dificultad: this.difToStr(r.dificultad as any),
      tipo: r.tipo ?? null,
      publicada: !!r.publicada,
      imageUrl: r.imageUrl ?? null,
      enlace: r.enlace ?? null,
      creado_en: r.creado_en,
      tags: r.tags ?? [],
      ingredients: r.ingredients ?? [],
      steps: r.steps ?? [],
      tips: r.tips ?? [],
      nutrition: r.nutrition ?? [],
      related: (r.related ?? []).map(x => ({
        titulo: x.titulo,
        descripcion: x.descripcion ?? null,
        tiempo: x.tiempo ?? '—',
        dificultad: this.difToStr(x.dificultad as any),
        imagen: x.imagen ?? null,
        enlace: x.enlace ?? null,
      })),
    };
  }

  /** Mapea y **PRESERVA** anidados si vienen en `p`. */
  private mapWritePayload(p: Partial<Receta> & Record<string, any>) {
    const body: any = {
      autor: { id: String(p.autor_id ?? '') },
      nombre: (p.nombre ?? '').toString().trim(),
      descripcion: (p.descripcion ?? '').toString(),
      porciones: Number(p.porciones ?? 0) || 0,
      tiempoPrep: Number(p.tiempoPrep ?? 0) || 0,
      tiempoCoc: Number(p.tiempoCoc ?? 0) || 0,
      categoria: this.catToId(p.categoria as any),
      dificultad: this.difToId(p.dificultad as any),
      tipo: null,
      publicada: !!p.publicada,
      imageUrl: p.imageUrl ?? null,
      enlace: p.enlace ?? null
    };

    if (Array.isArray(p.ingredients)) body.ingredients = p.ingredients;
    if (Array.isArray(p.steps))       body.steps       = p.steps;
    if (Array.isArray(p.tips))        body.tips        = p.tips;
    if (Array.isArray(p.nutrition))   body.nutrition   = p.nutrition;
    if (Array.isArray(p.related))     body.related     = p.related;
    if (Array.isArray(p.tags))        body.tags        = p.tags;

    if (p.creado_en) body.creado_en = p.creado_en;

    console.log('[mapWritePayload]', body);
    return body;
  }


  // ---------- API ----------
  getRecetas(params?: Record<string, string>) {
    let httpParams = new HttpParams();
    Object.entries(params ?? {}).forEach(([k, v]) => { if (v != null && v !== '') httpParams = httpParams.set(k, v); });
    return this.http.get<RecetaDTO[]>(`${this.base}/recetas`, { params: httpParams })
      .pipe(catchError(this.httpFail<RecetaDTO[]>('getRecetas')));
  }

  getRecetasByAutor(autorId: string | number) {
    return this.getRecetas().pipe(map(list => list.filter(r => String(r.autor_id) === String(autorId))));
  }

  getRecetasByCategoria(categoriaId: string | number) {
    return this.getRecetas({ categoria: String(categoriaId) });
  }

  getRecetaById(id: string | number) {
    return this.http.get<RecetaDetailDTO>(`${this.base}/recetas/${id}`)
      .pipe(map(r => this.toReceta(r)), catchError(this.httpFail<Receta>('getRecetaById')));
  }

  createReceta(payload: Partial<Receta> & Record<string, any>) {
    const body = self.crypto ? this.mapWritePayload(payload) : this.mapWritePayload(payload); // (mantengo firma limpia)
    console.log('[createReceta] →', body);
    return this.http.post<RecetaDetailDTO>(`${this.base}/recetas`, body)
      .pipe(catchError(this.httpFail<RecetaDetailDTO>('createReceta')));
  }

  updateReceta(id: string | number, payload: Partial<Receta> & Record<string, any>) {
    const body = this.mapWritePayload(payload);
    console.log('[updateReceta] →', id, body);
    return this.http.put<RecetaDetailDTO>(`${this.base}/recetas/${id}`, body)
      .pipe(catchError(this.httpFail<RecetaDetailDTO>('updateReceta')));
  }

  deleteReceta(id: string | number) {
    console.log('[deleteReceta] →', id);
    return this.http.delete<void>(`${this.base}/recetas/${id}`)
      .pipe(catchError(this.httpFail<void>('deleteReceta')));
  }

  // ---------- categorías ----------
  getCategorias() {
    return this.http.get<CategoriaDTO[]>(`${this.base}/categorias`).pipe(
      map(cats => cats.map(c => {
        const slug = c.nombre.toLowerCase().replace(/\s+/g, '-');
        return {
          id: c.id, nombre: c.nombre,
          imagen: c.imagen ?? `/assets/categorias/${slug}.webp`,
          enlace: `/all-recipes?categoria=${encodeURIComponent(String(c.id))}`
        } as Categoria;
      })),
      catchError(this.httpFail<Categoria[]>('getCategorias'))
    );
  }

  // ---------- featured ----------
  getFeaturedCards() {
    return this.getRecetas().pipe(map(rs => rs.map(r => this.toCard(r))));
  }
  getFeaturedCardsLatest(limit = 3) {
    return this.getRecetas().pipe(map(rs => rs.slice().sort((a, b) => Number(b.id) - Number(a.id)).slice(0, limit).map(r => this.toCard(r))));
  }
  getFeaturedCardsByCategoria(categoriaId: string | number) {
    return this.getRecetasByCategoria(categoriaId).pipe(map(rs => rs.map(r => this.toCard(r))));
  }
}

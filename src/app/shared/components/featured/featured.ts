// src/app/shared/components/featured/featured.ts
import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DificultadNombrePipe } from '../../pipes/dificultad-nombre.pipe';
import { EmptyState } from '../empty-state/empty-state';

export interface FeaturedCard {
  id: string | number;
  titulo: string;
  descripcion: string;
  imagen?: string | null;
  enlace: string;
  tiempo: string;
  dificultad: 'facil' | 'medio' | 'dificil';
}

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule, RouterLink, DificultadNombrePipe, EmptyState],
  templateUrl: './featured.html',
  styleUrls: ['./featured.css'],
})
export class Featured {
  private _cards: FeaturedCard[] = [];
  @Input() set cards(v: FeaturedCard[] | null | undefined)   { this._cards = v ?? []; }
  @Input() set recipes(v: FeaturedCard[] | null | undefined) { this._cards = v ?? []; }
  get cardsList(): FeaturedCard[] { return this._cards; }

  @Input() actionsTemplate?: TemplateRef<unknown>;

  trackById = (_: number, c: FeaturedCard) => String(c?.id ?? '');
  imgSrc(c: FeaturedCard): string {
    const src = (c.imagen ?? '').trim();
    return src && src !== 'null' && src !== 'undefined' ? src : '/assets/placeholder.webp';
  }
}

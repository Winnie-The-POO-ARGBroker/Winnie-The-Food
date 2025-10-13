import { Component, Input, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { EmptyState } from '../empty-state/empty-state';

export interface FeaturedCard {
  id?: string | number;
  titulo: string;
  descripcion: string;
  imagen: string;
  enlace: string;
  tiempo: string;
  dificultad: 'facil' | 'medio' | 'dificil';
}

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, EmptyState],
  templateUrl: './featured.html',
  styleUrl: './featured.css'
})
export class Featured {
  @Input() recipes: FeaturedCard[] = [];
  @Input() actionsTemplate: TemplateRef<{ $implicit: FeaturedCard }> | null = null;
}

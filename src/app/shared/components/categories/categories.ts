import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../../models/categories-models';
import { EmptyState } from '../empty-state/empty-state';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, EmptyState],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class Categories {
  @Input({ required: true }) categories: Categoria[] = [];
}

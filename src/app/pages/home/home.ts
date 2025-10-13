import { Component, OnInit, inject } from '@angular/core';
import { Featured } from '../../shared/components/featured/featured';
import { Categories } from '../../shared/components/categories/categories';
import { Categoria } from '../../models/categories-models';
import type { FeaturedCard } from '../../shared/components/featured/featured';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Featured, Categories],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  private route = inject(ActivatedRoute);

  categoriesArray: Categoria[] = [];
  featuredRecipesArray: FeaturedCard[] = [];

  errorCats = '';
  errorFeat = '';

  ngOnInit(): void {
    this.route.data.subscribe(d => {
      this.categoriesArray = d['categorias'] ?? [];
      const feats = ((d['featured'] as FeaturedCard[] | undefined) ?? [])
        .slice()
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 3);
      this.featuredRecipesArray = feats;
    });
  }
}

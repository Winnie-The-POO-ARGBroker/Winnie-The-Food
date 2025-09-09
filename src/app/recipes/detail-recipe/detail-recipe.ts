import { Component } from '@angular/core';
import { Menu } from '../../shared/components/menu/menu';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-detail-recipe',
  imports: [ Menu, Footer ],
  templateUrl: './detail-recipe.html',
  styleUrl: './detail-recipe.css'
})
export class DetailRecipe {

}

import { Component } from '@angular/core';
import { Menu } from '../../shared/components/menu/menu';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-new-recipe',
  imports: [ Menu, Footer ],
  templateUrl: './new-recipe.html',
  styleUrl: './new-recipe.css'
})
export class NewRecipe {

}

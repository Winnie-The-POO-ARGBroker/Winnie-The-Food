import { Component } from '@angular/core';
import { Menu } from '../../shared/components/menu/menu';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-all-recipes',
  imports: [ Menu, Footer ],
  templateUrl: './all-recipes.html',
  styleUrl: './all-recipes.css'
})
export class AllRecipes {

}

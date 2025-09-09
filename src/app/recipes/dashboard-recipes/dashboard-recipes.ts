import { Component } from '@angular/core';
import { Menu } from '../../shared/components/menu/menu';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-dashboard-recipes',
  imports: [ Menu, Footer ],
  templateUrl: './dashboard-recipes.html',
  styleUrl: './dashboard-recipes.css'
})
export class DashboardRecipes {

}

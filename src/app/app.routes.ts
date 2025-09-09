import { Routes } from '@angular/router';
import { Home } from './pages/home/home.js';
import { About } from './pages/about/about.js';
import { Login } from './auth/login/login.js';
import { Register } from './auth/register/register.js';
import { AllRecipes } from './recipes/all-recipes/all-recipes.js';
import { DashboardRecipes } from './recipes/dashboard-recipes/dashboard-recipes.js';
import { DetailRecipe } from './recipes/detail-recipe/detail-recipe.js';
import { NewRecipe } from './recipes/new-recipe/new-recipe.js';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'all-recipes', component: AllRecipes },
  { path: 'dashboard-recipes', component: DashboardRecipes },
  { path: 'detail-recipe', component: DetailRecipe },
  { path: 'new-recipe', component: NewRecipe }
];


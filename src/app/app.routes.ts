import { Routes } from '@angular/router';
import { Home } from './pages/home/home.js';
import { About } from './pages/about/about.js';
import { Login } from './auth/login/login.js';
import { Register } from './auth/register/register.js';
import { AllRecipes } from './recipes/all-recipes/all-recipes.js';
import { DashboardRecipes } from './recipes/dashboard-recipes/dashboard-recipes.js';
import { DetailRecipe } from './recipes/detail-recipe/detail-recipe.js';
import { NewRecipeShell } from './recipes/new-recipe/new-recipe-shell/new-recipe-shell';
import { StepBasicInfo } from './recipes/new-recipe/steps/step-basic-info/step-basic-info';
import { StepIngredients } from './recipes/new-recipe/steps/step-ingredients/step-ingredients';
import { StepProcessTips } from './recipes/new-recipe/steps/step-process-tips/step-process-tips';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'all-recipes', component: AllRecipes },
  { path: 'dashboard-recipes', component: DashboardRecipes },
  { path: 'detail-recipe', component: DetailRecipe },
  {
    path: 'new-recipe',
    component: NewRecipeShell,
    children: [
      { path: '', redirectTo: 'step-1', pathMatch: 'full' },
      { path: 'step-1', component: StepBasicInfo, title: 'Nueva receta · Paso 1' },
      { path: 'step-2', component: StepIngredients, title: 'Nueva receta · Paso 2' },
      { path: 'step-3', component: StepProcessTips, title: 'Nueva receta · Paso 3' }
    ]
  }
];


import { Routes } from '@angular/router';

// Componentes
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
import { EmptyState } from './shared/components/empty-state/empty-state.js';
import { authGuard } from './auth/auth.guard.js';

// Resolvers funcionales
import { allRecipesResolver } from './core/resolvers/recipes.resolver';
import { recipeDetailResolver } from './core/resolvers/recipe-detail.resolver';
import { categoriesResolver } from './core/resolvers/categories.resolver';
import { myRecipesResolver } from './core/resolvers/dashboard-recipes.resolver';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    resolve: {
      categorias: categoriesResolver,
      featured: allRecipesResolver,
    },
    title: 'Winnie The Food - Recetas caseras fáciles y deliciosas'
  },

  { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'all-recipes',
    component: AllRecipes,
    resolve: {
      recetas: allRecipesResolver,
      categorias: categoriesResolver,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'Todas las recetas'
  },

  {
    path: 'dashboard-recipes',
    component: DashboardRecipes,
    resolve: {
      recetas: myRecipesResolver,
    },
    title: 'Mis recetas'
  },

  {
    path: 'detail-recipe/:id',
    component: DetailRecipe,
    resolve: {
      receta: recipeDetailResolver,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'Detalle de la receta'
  },

  {
    path: 'new-recipe',
    component: NewRecipeShell,
    resolve: { categorias: categoriesResolver },
    children: [
      { path: '', redirectTo: 'step-1', pathMatch: 'full' },
      { path: 'step-1', component: StepBasicInfo, canActivate: [authGuard], title: 'Nueva receta · Paso 1' },
      { path: 'step-2', component: StepIngredients, canActivate: [authGuard], title: 'Nueva receta · Paso 2' },
      { path: 'step-3', component: StepProcessTips, canActivate: [authGuard], title: 'Nueva receta · Paso 3' }
    ]
  },

  { path: '**', component: EmptyState, title: 'Página no encontrada' }
];

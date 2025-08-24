import { Component} from '@angular/core';
import { Featured } from '../../shared/components/featured/featured';

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [ Featured ],
  templateUrl: './all-recipes.html',
  styleUrl: './all-recipes.css'
})
export class AllRecipes {

 featuredRecipesArray = [
  {
    titulo: 'Tacos',
    descripcion: 'Clásicos de la cocina mexicana, con tortillas suaves rellenas y combinaciones irresistibles.',
    imagen: '/img-recipe-1.webp',
    enlace: '/detail-recipe/1',
    tiempo: '45 min',
    dificultad: 'facil'
  },
  {
    titulo: 'Tarta de Chocolate',
    descripcion: 'Postre irresistible con base crocante y relleno cremoso de chocolate.',
    imagen: '/img-recipe-2.webp',
    enlace: '/detail-recipe/2',
    tiempo: '60 min',
    dificultad: 'medio'
  },
  {
    titulo: 'Sushi',
    descripcion: 'Delicados rollos de arroz y pescado con sabores frescos.',
    imagen: '/img-recipe-3.webp',
    enlace: '/detail-recipe/3',
    tiempo: '90 min',
    dificultad: 'dificil'
  },
  {
    titulo: 'Pasta Carbonara',
    descripcion: 'Cremosa pasta italiana con panceta, huevos y queso parmesano.',
    imagen: '/img-recipe-1.webp',
    enlace: '/detail-recipe/4',
    tiempo: '25 min',
    dificultad: 'facil'
  },
  {
    titulo: 'Pizza Margarita',
    descripcion: 'Pizza italiana clásica con tomate, mozzarella y albahaca fresca.',
    imagen: '/img-recipe-2.webp',
    enlace: '/detail-recipe/5',
    tiempo: '30 min',
    dificultad: 'medio'
  },
  {
    titulo: 'Paella Valenciana',
    descripcion: 'Tradicional paella española con arroz, pollo, conejo y verduras.',
    imagen: '/img-recipe-3.webp',
    enlace: '/detail-recipe/6',
    tiempo: '50 min',
    dificultad: 'dificil'
  },
  {
    titulo: 'Ensalada César',
    descripcion: 'Refrescante ensalada con lechuga romana, crutones y aderezo césar.',
    imagen: '/img-recipe-1.webp',
    enlace: '/detail-recipe/7',
    tiempo: '15 min',
    dificultad: 'facil'
  },
  {
    titulo: 'Risotto de Hongos',
    descripcion: 'Cremoso arroz italiano con hongos variados y vino blanco.',
    imagen: '/img-recipe-2.webp',
    enlace: '/detail-recipe/8',
    tiempo: '35 min',
    dificultad: 'medio'
  },
  {
    titulo: 'Ramen Japonés',
    descripcion: 'Sopa japonesa con fideos, caldo rico y diversos toppings tradicionales.',
    imagen: '/img-recipe-3.webp',
    enlace: '/detail-recipe/9',
    tiempo: '120 min',
    dificultad: 'dificil'
  }
];
verMasRecetas() {
    console.log('Ver más recetas clickeado');
}

}

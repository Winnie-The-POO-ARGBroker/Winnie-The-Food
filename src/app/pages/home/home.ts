import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categories } from '../../shared/components/categories/categories';
import { Featured } from '../../shared/components/featured/featured';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ Categories, CommonModule, Featured],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  @ViewChild('navBar') navBar!: ElementRef<HTMLElement>;
  @ViewChild('navLinks') navLinks!: ElementRef<HTMLElement>;

  // Reemplaza el script de scroll:
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.navBar) return;

    const n = this.navBar.nativeElement;
    const links = this.navLinks?.nativeElement;

    if (window.scrollY > 100) {
      n.classList.add('bg-white', 'shadow-sm');            // Bootstrap sí tiene bg-white y shadow-sm
      n.classList.add('backdrop-blur-lg')
      links?.classList.remove('bg-white', 'shadow-sm');
    } else {
      n.classList.remove('bg-white', 'shadow-sm');
      links?.classList.add('bg-white', 'shadow-sm');
    }
  }

  categoriesArray = [
    { nombre: 'Desayunos', imagen: '/img-cat-1.webp', enlace: '#desayunos' },
    { nombre: 'Comidas Rápidas', imagen: '/img-cat-2.webp', enlace: '#comidas-rapidas' },
    { nombre: 'Vegetarianas', imagen: '/img-cat-3.webp', enlace: '#vegetarianas' },
    { nombre: 'Postres', imagen: '/img-cat-4.webp', enlace: '#postres' },
    { nombre: 'Sopas', imagen: '/img-cat-5.webp', enlace: '#sopas' },
    { nombre: 'Carnes', imagen: '/img-cat-6.webp', enlace: '#carnes' },
  ];
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
  }
];

}

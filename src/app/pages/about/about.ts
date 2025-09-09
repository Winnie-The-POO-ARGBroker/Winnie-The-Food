import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';           // ✅ para *ngFor
import { CardDev, Developer } from '../../shared/components/card-dev/card-dev'; // ✅ ruta y tipo

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, CardDev],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class About {
  developers: Developer[] =[
    { nombre: 'Rodrigo Valdez', rol: 'Scrum master - Developer', imagen: '/nosotros/img-avatar-rodrigo.webp', href: '/portfolios/rodrigo/index.html', target: '_blank' },
    { nombre: 'Franco Arce',    rol: 'Developer',                imagen: '/nosotros/img-avatar-franco.webp',   href: '/portfolios/franco/index.html',   target: '_blank' },
    { nombre: 'Magali Bechis',  rol: 'Developer',                imagen: '/nosotros/img-avatar-maga.webp',   href: '/portfolios/magali/index.html',   target: '_blank' },
    { nombre: 'Eliana Di Lorenzo Vera', rol: 'Developer',        imagen: '/nosotros/img-avatar-eliana.webp',   href: '/portfolios/eliana/index.html',   target: '_blank' },
    { nombre: 'Jimena Galleguillo',     rol: 'Developer',        imagen: '/nosotros/img-avatar-jime.webp',   href: '/portfolios/jimena/index.html',   target: '_blank' },
    { nombre: 'Gianna Giavarini',       rol: 'Developer',        imagen: '/nosotros/img-avatar-gianna.webp',   href: '/portfolios/gianna/index.html',   target: '_blank' },
    { nombre: 'Gisele Lavisse',         rol: 'Developer',        imagen: '/nosotros/img-avatar-gise.webp',   href: '/portfolios/gisele/index.html',   target: '_blank' },
  ];

  // (opcional) para trackBy en *ngFor
  trackByNombre = (_: number, d: Developer) => d.nombre;
}

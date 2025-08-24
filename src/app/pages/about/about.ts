import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';           // ✅ para *ngFor
import { CardDev, Developer } from '../../shared/components/card-dev/card-dev'; // ✅ ruta y tipo

@Component({
  selector: 'app-about',
  standalone: true,                      // ✅ standalone
  imports: [CommonModule, CardDev],      // ✅ CommonModule + tu componente standalone
  templateUrl: './about.html',
  styleUrls: ['./about.css'],            // ✅ plural
})
export class About {
  developers: Developer[] = [
    { nombre: 'Rodrigo Valdez', rol: 'Scrum master - Developer', imagen: './imagenes/nosotros/img-avatar-rodrigo.webp' },
    { nombre: 'Franco Arce', rol: 'Developer', imagen: './imagenes/nosotros/img-avatar-franco.webp' },
    { nombre: 'Magali Bechis', rol: 'Developer', imagen: './imagenes/nosotros/img-avatar-magali.webp' },
    { nombre: 'Eliana Di Lorenzo Vera', rol: 'Developer', imagen: './imagenes/nosotros/img-avatar-eliana.webp' },
    { nombre: 'Jimena Galleguillo', rol: 'Developer', imagen: './imagenes/nosotros/img-avatar-jimena.webp' },
    { nombre: 'Gianna Giavarini', rol: 'Developer', imagen: './imagenes/nosotros/img-avatar-gianna.webp' },
    { nombre: 'Gisele Lavisse', rol: 'Developer', imagen: './imagenes/nosotros/img-avatar-gisele.webp' },
  ];

  // (opcional) para trackBy en *ngFor
  trackByNombre = (_: number, d: Developer) => d.nombre;
}

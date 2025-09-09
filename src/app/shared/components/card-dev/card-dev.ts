import { Component, Input } from '@angular/core';

// La interfaz estaba metida despues de la declaracion del componente, la saque para poder usarla en about.ts. Este era uno de los dramas
export interface Developer {
  nombre: string;
  rol: string;
  imagen: string;
  href?: string;
  target?: '_self' | '_blank';
  alt?: string;
}

@Component({
  selector: 'app-card-dev',
  standalone: true,
  templateUrl: './card-dev.html',
  styleUrls: ['./card-dev.css'],
})
export class CardDev {
  @Input() nombre = '';
  @Input() rol = '';
  @Input() imagen = '';
  @Input() href?: string | null;
  @Input() target?: '_self' | '_blank';
  @Input() alt = '';
}


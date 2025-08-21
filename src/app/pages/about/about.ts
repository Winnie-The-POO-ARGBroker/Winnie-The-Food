import { Component } from '@angular/core';
import { Menu } from '../../shared/components/menu/menu';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-about',
  imports: [ Menu, Footer ],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

}

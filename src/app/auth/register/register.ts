import { Component } from '@angular/core';
import { Menu } from '../../shared/components/menu/menu';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-register',
  imports: [ Menu, Footer ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

}

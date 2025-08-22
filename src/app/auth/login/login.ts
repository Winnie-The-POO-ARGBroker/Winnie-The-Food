import { Component } from '@angular/core';
import { Menu } from '../../shared/components/menu/menu';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-login',
  imports: [ Menu, Footer ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}

import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Menu } from '../../shared/components/menu/menu';
import { Footer } from '../../shared/components/footer/footer';


@Component({
  selector: 'app-home',
  imports: [ Menu, Footer ],
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
}

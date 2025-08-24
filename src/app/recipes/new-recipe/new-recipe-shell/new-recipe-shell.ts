import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-new-recipe-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './new-recipe-shell.html',
  styleUrls: ['../new-recipe.css', './new-recipe-shell.css'],
})
export class NewRecipeShell {
  activeStep = 1;
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith({ url: this.router.url } as NavigationEnd),
      map((e: any) => e.url as string)
    ).subscribe(url => {
      this.activeStep = url.includes('step-3') ? 3 : url.includes('step-2') ? 2 : 1;
    });
  }
}

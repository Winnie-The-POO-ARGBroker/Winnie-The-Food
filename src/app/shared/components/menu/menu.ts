import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  private auth = inject(AuthService);

  isLoggedIn = this.auth.isAuthenticated; // signal
  userName   = computed(() => this.auth.currentUser()?.nombre ?? '');

  logout() {
    this.auth.logout();
  }
}

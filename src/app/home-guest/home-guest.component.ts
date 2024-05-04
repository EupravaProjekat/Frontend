import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-guest',
  standalone: true,
  imports: [],
  templateUrl: './home-guest.component.html',
  styleUrl: './home-guest.component.css'
})
export class HomeGuestComponent {
  
  constructor(private router: Router, private auth: AuthService) {

  }
  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}

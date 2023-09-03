import { Component } from '@angular/core';
import { AuthService, User, adminAppUrl } from 'ecomLib';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user: User | null = null;
  isShowing!: boolean;
  adminRoute = adminAppUrl;
  constructor(private authService: AuthService) {
    this.authService.$user.subscribe((data) => {
      this.user = data;
    });
  }
}

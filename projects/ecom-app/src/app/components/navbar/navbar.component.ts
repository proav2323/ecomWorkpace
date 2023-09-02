import { Component } from '@angular/core';
import { AuthService, User } from 'ecomLib';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user: User | null = null;
  isShowing!: boolean;
  constructor(private authService: AuthService) {
    this.authService.$user.subscribe((data) => {
      this.user = data;
    });
  }
}

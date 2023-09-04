import { Component } from '@angular/core';
import { AuthService, User, adminAppUrl } from 'ecomLib';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user: User | null = null;
  isShowing!: boolean;
  adminRoute = adminAppUrl;
  mobileSearch!: boolean;
  $mobileSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private authService: AuthService) {
    this.authService.$user.subscribe((data) => {
      this.user = data;
    });
    this.$mobileSearch.subscribe((data) => {
      this.mobileSearch = data;
    });
  }
  toggleMobileSearch(value: boolean) {
    this.$mobileSearch.next(value);
  }
}

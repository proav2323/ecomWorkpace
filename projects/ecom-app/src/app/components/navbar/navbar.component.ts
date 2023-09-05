import { Component } from '@angular/core';
import { AuthService, User, adminAppUrl } from 'ecomLib';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  $background: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isBackground: boolean = false;

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.authService.$user.subscribe((data) => {
      this.user = data;
    });
    this.$mobileSearch.subscribe((data) => {
      this.mobileSearch = data;
    });
    this.$background.subscribe((data) => {
      this.isBackground = data;
    });
    window.addEventListener('scroll', (e) => {
      if (window.scrollY < 10) {
        this.$background.next(false);
      } else {
        this.$background.next(true);
      }
      console.log('hi');
    });
  }
  toggleMobileSearch(value: boolean) {
    this.$mobileSearch.next(value);
  }
}

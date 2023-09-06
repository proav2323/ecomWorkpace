import { Component } from '@angular/core';
import { AuthService, CartService, User, adminAppUrl, cart } from 'ecomLib';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  cart!: cart | null;
  formGroup = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private cartService: CartService,
    private router: Router
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
    this.cartService.$cart.subscribe((data) => {
      this.cart = data;
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
  search(e: any) {
    console.log('hiihdghdg');
    if (this.formGroup.valid) {
      if (e.keyCode === 13) {
        this.router.navigate(['search'], {
          queryParams: { search: this.formGroup.controls.search.value! },
        });
      }
    }
  }
}

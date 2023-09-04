import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService, OrdersService, User } from 'ecomLib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private breakpointObserver = inject(BreakpointObserver);
  type: string = 'daily';
  user: User | null = null;
  mobileSearch!: boolean;
  $mobileSearch: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private orderService: OrdersService,
    private authService: AuthService
  ) {
    this.$mobileSearch.subscribe((data) => {
      this.mobileSearch = data;
    });
    this.authService.$user.subscribe((data) => {
      this.user = data;
    });
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.decodeToken(token);
    }
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  toggleMobileSearch(value: boolean) {
    this.$mobileSearch.next(value);
  }
}

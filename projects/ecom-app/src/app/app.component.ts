import { Component, inject } from '@angular/core';
import { JWTService } from './services/jwt.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  constructor(private jwtService: JWTService) {
    const token = localStorage.getItem('token');
    if (token) {
      this.jwtService.decodeToken(token);
      initFlowbite();
    }
  }
}

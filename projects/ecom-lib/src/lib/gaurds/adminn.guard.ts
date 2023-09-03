import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanMatch,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { adminCheck, baseUrl } from '../utils/constants';
import { ecomAppUrl } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class AdminnGuard
  implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanMatch
{
  constructor(
    private HttpClient: HttpClient,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token === null) {
      this.router.navigateByUrl('/login');
      this.snackbar.open('login first', 'got it');
      return false;
    } else {
      const queryParams: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token,
      });
      const data = this.HttpClient.get<boolean>(`${baseUrl}${adminCheck}`, {
        headers: queryParams,
      });
      data.subscribe(
        (data) => {
          if (data) {
          }
        },
        (Err) => {
          if (Err.error === 'not a admin') {
            this.snackbar.open(
              'you are not the allowed in this route',
              'got it'
            );
            this.router.navigateByUrl(ecomAppUrl);
          } else {
            this.router.navigateByUrl('/login');
            this.snackbar.open('login again', 'got it');
          }
        }
      );
      return data;
    }
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
  canMatch(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}

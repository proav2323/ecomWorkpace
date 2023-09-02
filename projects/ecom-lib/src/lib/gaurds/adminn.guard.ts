import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { adminCheck, baseUrl } from '../utils/constants';

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
      return true;
    } else {
      const queryParams: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token,
      });
      const data = this.HttpClient.get<boolean>(`${baseUrl}${adminCheck}`, {
        headers: queryParams,
      });
      data.subscribe((data) => {
        if (data) {
        } else {
          this.snackbar.open('you are the allowed in this route', 'got it');
          this.router.navigateByUrl('/');
        }
      });
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

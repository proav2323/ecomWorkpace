import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { baseUrl, logincheckToken } from '../utils/constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard
  implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanMatch
{
  constructor(
    private router: Router,
    private HttpClient: HttpClient,
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
      const data = this.HttpClient.get<boolean>(
        `${baseUrl}${logincheckToken}`,
        {
          headers: queryParams,
        }
      );
      data.subscribe((data) => {
        if (data) {
        } else {
          this.snackbar.open(
            "you logged into your account so you can't login again...",
            'got it'
          );
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

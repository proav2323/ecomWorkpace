import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService, decodeToken } from 'ecomLib';
import { baseUrl } from 'projects/ecom-lib/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class JWTService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}
  decodeToken(token: string) {
    if (token) {
      const data = this.httpClient.get<{ id: string }>(
        `${baseUrl}${decodeToken}/${token}`
      );
      data.subscribe(
        (data) => {
          this.authService.getUser(data.id);
          console.log(data.id);
        },
        (Err) => {
          console.log(Err);
        }
      );
    }
  }
}

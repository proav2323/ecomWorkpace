import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  baseUrl,
  decodeToken,
  deleteUser,
  getAllUsers,
  getUser,
  login,
  signUp,
  updateUser,
  uploadImage,
} from '../utils/constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  $loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  $imgLoding: BehaviorSubject<boolean> = new BehaviorSubject(false);
  $user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  constructor(private httpClient: HttpClient, private router: Router) {}

  getUser(id: string) {
    const data = this.httpClient.get<{
      success: boolean;
      data: {
        email: string;
        name: string;
        imgUrl: string;
        role: string;
        password: string;
        wishlist: { productId: string }[];
        _id: string;
      };
    }>(`${baseUrl}${getUser}/${id}`);
    data.subscribe(
      (data) => {
        this.$user.next(data.data as User);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  login(email: string, password: string, $error: BehaviorSubject<string>) {
    this.$loading.next(true);
    const data = this.httpClient.post<{
      success: boolean;
      data: {
        email: string;
        userId: string;
        token: string;
      };
    }>(`${baseUrl}${login}`, { email: email, password: password });
    data.subscribe(
      (data) => {
        localStorage.setItem('token', data.data.token);
        this.getUser(data.data.userId);
        this.$loading.next(false);
        this.router.navigateByUrl('/');
      },
      (err) => {
        console.log(err);
        if (err.error === 'please fill the fields first') {
          $error.next('please fill your information first');
          this.$loading.next(false);
        } else if (err.error === 'user not found') {
          $error.next('user not found with the email');
          this.$loading.next(false);
        } else if (err.error === 'wrong password') {
          $error.next('wrong password for the email uses');
          this.$loading.next(false);
        } else {
          $error.next('internal error... try again later');
          this.$loading.next(false);
        }
      }
    );
  }
  uploadImage(
    file: any,
    subject: BehaviorSubject<string>,
    $error: BehaviorSubject<string>
  ) {
    this.$imgLoding.next(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    const data = this.httpClient.post<{
      success: boolean;
      url: string;
    }>(`${baseUrl}${uploadImage}`, uploadData);
    data.subscribe(
      (data) => {
        subject.next(data.url);
        this.$imgLoding.next(false);
      },
      (err) => {
        if (err.error === "User doesn't have permission to access the object") {
          $error.next('internal error..  try again later');
          this.$imgLoding.next(false);
        } else if (err.error === 'User canceled the upload') {
          $error.next('internal error..  try again later');
          this.$imgLoding.next(false);
        } else if (err.error === 'storage/unknown') {
          $error.next('internal error..  try again later');
          this.$imgLoding.next(false);
        } else if (err.error === 'please send a file to continue') {
          $error.next('please send a file to continue');
          this.$imgLoding.next(false);
        }
      }
    );
  }
  signUp(
    name: string,
    email: string,
    password: string,
    imgUrl: string,
    $error: BehaviorSubject<string>
  ) {
    this.$loading.next(true);
    const data = this.httpClient.post<{
      success: true;
      data: {
        email: string;
        userId: string;
        token: string;
      };
    }>(`${baseUrl}${signUp}`, {
      email: email,
      password: password,
      name: name,
      imgUrl: imgUrl,
      role: email === 'anshvishesh03@gmail.com' ? 'admin' : 'user',
      wishlist: [],
    });
    data.subscribe(
      (data) => {
        localStorage.setItem('token', data.data.token);
        this.getUser(data.data.userId);
        this.$loading.next(false);
        this.router.navigateByUrl('/');
      },
      (err) => {
        if (err.error === 'user found with the email') {
          $error.next('user found with the email');
          this.$loading.next(false);
        } else if (err.error === 'please fill the fields first') {
          $error.next('fill the fields first');
          this.$loading.next(false);
        } else {
          $error.next('internal error...');
          this.$loading.next(false);
        }
      }
    );
  }
  chnageRoute(route: string) {
    this.router.navigateByUrl(route);
  }
  decodeToken(token: string) {
    if (token) {
      const data = this.httpClient.get<{ id: string }>(
        `${baseUrl}${decodeToken}/${token}`
      );
      data.subscribe(
        (data) => {
          this.getUser(data.id);
          console.log(data.id);
        },
        (Err) => {
          console.log(Err);
        }
      );
    }
  }
  getReviewUser(id: string) {
    const data = this.httpClient.get<{
      success: boolean;
      data: {
        email: string;
        name: string;
        imgUrl: string;
        role: string;
        password: string;
        wishlist: { productId: string }[];
        _id: string;
      };
    }>(`${baseUrl}${getUser}/${id}`);
    return data;
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
    this.$user.next(null);
  }
  getAllUsers(): Observable<{ success: boolean; data: User[] }> {
    this.$loading.next(true);
    const data = this.httpClient.get<{ success: boolean; data: User[] }>(
      `${baseUrl}${getAllUsers}`
    );
    return data;
  }
  updateUser(
    id: string,
    name: string,
    role: string,
    imgUrl: string,
    email: string,
    wishlist: { productId: string }[]
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      const queryParams: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token,
      });
      const data = this.httpClient.put<{
        success: boolean;
        data: string;
      }>(
        `${baseUrl}${updateUser}${id}`,
        {
          name: name,
          role: role,
          imgUrl: imgUrl,
          email: email,
          wishlist: wishlist,
        },
        { headers: queryParams }
      );
      data.subscribe(
        (data) => {
          this.getAllUsers();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  deleteUser(id: string) {
    const token = localStorage.getItem('token');
    if (token) {
      const queryParams: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token,
      });
      const data = this.httpClient.delete<{
        success: true;
        data: string;
      }>(`${baseUrl}${deleteUser}${id}`, {
        headers: queryParams,
      });
      data.subscribe(
        (data) => {
          this.getAllUsers();
        },
        (Err) => {
          console.log(Err);
        }
      );
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { categories } from '../models/categories';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  addCategories,
  baseUrl,
  deleteCategory,
  getAllCategories,
  updateCategories,
} from '../utils/constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  $Categories: BehaviorSubject<categories[]> = new BehaviorSubject<
    categories[]
  >([]);
  $loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient, private Snackbar: MatSnackBar) {}

  getAllCategories(token: string) {
    this.$loading.next(true);
    const queryParams: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    const data = this.httpClient.get<{ success: boolean; data: categories[] }>(
      `${baseUrl}${getAllCategories}`,
      { headers: queryParams }
    );
    data.subscribe(
      (data) => {
        this.$Categories.next(data.data);
        this.$loading.next(false);
      },
      (err) => {
        console.log(err);
        this.$loading.next(false);
      }
    );
  }

  addCategories(
    name: string,
    imgUrl: string,
    error: BehaviorSubject<string>,
    token: string
  ) {
    this.$loading.next(true);
    const queryParams: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    const data = this.httpClient.post(
      `${baseUrl}${addCategories}`,
      {
        name: name,
        imgUrl: imgUrl,
      },
      { headers: queryParams }
    );
    data.subscribe(
      (data) => {
        console.log('added');
        this.getAllCategories(token);
        this.Snackbar.open('category added', 'close');
        this.$loading.next(false);
      },
      (err) => {
        if (err.error === 'send values') {
          error.next('fill the fields first');
          this.$loading.next(false);
        } else if (err.error === 'internal error') {
          error.next('internal error');
          this.$loading.next(false);
        } else {
          error.next('internal error');
          this.$loading.next(false);
        }
      }
    );
  }

  updateCategories(
    id: string,
    name: string,
    imgUrl: string,
    error: BehaviorSubject<string>,
    token: string
  ) {
    this.$loading.next(true);
    const queryParams: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    const data = this.httpClient.put(
      `${baseUrl}${updateCategories}/${id}`,
      {
        name: name,
        imgUrl: imgUrl,
      },
      { headers: queryParams }
    );
    data.subscribe(
      (data) => {
        console.log('updated');
        this.getAllCategories(token);
        this.$loading.next(false);
      },
      (err) => {
        if (err.error === 'send values') {
          error.next('fill the fields first');
          this.$loading.next(false);
        } else if (err.error === 'internal error') {
          error.next('internal error');
          this.$loading.next(false);
        } else {
          error.next('internal error');
          this.$loading.next(false);
        }
      }
    );
  }
  deleteCategory(id: string, token: string) {
    this.$loading.next(true);
    const queryParams: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    const data = this.httpClient.delete<{ success: boolean; messages: string }>(
      `${baseUrl}${deleteCategory}/${id}`,
      { headers: queryParams }
    );
    data.subscribe(
      (data) => {
        this.getAllCategories(token);
        this.$loading.next(false);
      },
      (Err) => {
        if (Err.error === 'please send a valid id') {
          this.Snackbar.open('send a id');
          this.$loading.next(false);
        } else if (Err.error === 'something went wrong') {
          this.Snackbar.open('something went wrong');
          this.$loading.next(false);
        }
      }
    );
  }
}

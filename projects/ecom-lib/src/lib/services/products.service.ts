import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  addProduct,
  baseUrl,
  deleteProduct,
  getAllProducts,
  getCategoryProducts,
  updateProduct,
  getBannerProduct,
} from '../utils/constants';
import { product } from '../models/Product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { reviews } from '../models/reviews';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  $product: BehaviorSubject<product[]> = new BehaviorSubject<product[]>([]);
  $loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  $categoryProducts: BehaviorSubject<product[]> = new BehaviorSubject<
    product[]
  >([]);
  $bannerProduct: BehaviorSubject<product | null> =
    new BehaviorSubject<product | null>(null);
  constructor(
    private httpClient: HttpClient,
    private Snackbar: MatSnackBar,
    private Router: Router
  ) {}

  getAllProducts(token: string) {
    this.$loading.next(true);
    const queryParams: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    const data = this.httpClient.get<{
      success: boolean;
      data: product[];
    }>(`${baseUrl}${getAllProducts}`, {
      headers: queryParams,
    });
    data.subscribe(
      (data) => {
        this.$product.next(data.data);
        this.$loading.next(false);
      },
      (Err) => {
        console.log(Err);
        this.$loading.next(false);
      }
    );
  }

  getCategoryProducts(categoryName: string) {
    const data = this.httpClient.get<{ success: boolean; data: product[] }>(
      `${baseUrl}${getCategoryProducts}/${categoryName}`
    );
    data.subscribe(
      (data) => {
        this.$categoryProducts.next(data.data);
      },
      (Err) => {
        console.log(Err);
      }
    );
  }

  getBannerProduct() {
    const data = this.httpClient.get<{ success: boolean; data: product }>(
      `${baseUrl}${getBannerProduct}`
    );
    data.subscribe(
      (data) => {
        this.$bannerProduct.next(data.data);
      },
      (Err) => {
        console.log(Err);
      }
    );
  }

  addProduct(
    token: string,
    name: string,
    images: string[],
    description: string,
    price: number,
    category: string,
    stock: number,
    error: BehaviorSubject<string>,
    isBanner: boolean,
    bannerText: string
  ) {
    this.$loading.next(true);
    const queryParams: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    const data = this.httpClient.post<{ success: boolean; data: string }>(
      `${baseUrl}${addProduct}`,
      {
        name: name,
        images: images,
        description: description,
        price: price,
        category: category,
        stock: stock,
        createdOn: Date.now(),
        reviews: [],
        ratings: 0,
        isBanner: isBanner,
        bannerText: bannerText,
      },
      { headers: queryParams }
    );
    data.subscribe(
      (data) => {
        this.Snackbar.open('product added', 'close');
        this.getAllProducts(token);
        this.$loading.next(false);
        this.Router.navigateByUrl('/products');
      },
      (Err) => {
        if (Err.error === 'please fill the fields') {
          error.next('fill the fields');
          this.$loading.next(false);
        } else if (Err.error === 'internal error') {
          error.next('internal error');
          this.$loading.next(false);
        } else {
          error.next('internal error');
          this.$loading.next(false);
        }
      }
    );
  }

  updateProduct(
    id: string,
    token: string,
    name: string,
    description: string,
    images: string[],
    price: number,
    category: string,
    ratings: number,
    reviews: reviews[],
    stock: number,
    error: BehaviorSubject<string> = new BehaviorSubject(''),
    isBanner: boolean,
    bannerText: string
  ) {
    this.$loading.next(true);
    const queryParams: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    const data = this.httpClient.put<{ success: boolean; message: string }>(
      `${baseUrl}${updateProduct}`,
      {
        id: id,
        name: name,
        description: description,
        images: images,
        price: price,
        category: category,
        ratings: ratings,
        reviews: reviews,
        stock: stock,
        isBanner: isBanner,
        bannerText: bannerText,
      },
      { headers: queryParams }
    );

    data.subscribe(
      (data) => {
        this.Snackbar.open('product updated', 'close');
        this.getAllProducts(token);
        this.Router.navigateByUrl('/products');
        this.$loading.next(false);
      },
      (err) => {
        if (err.error === 'please fillt he fields') {
          error.next('fill the fields first');
        } else if (
          err.error ===
          'something went wrong please try again later or contact admin for further assistance'
        ) {
          error.next(
            'something went wrong please try again later or contact admin for further assistance'
          );
        } else {
          error.next('internal error');
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
      `${baseUrl}${deleteProduct}${id}`,
      { headers: queryParams }
    );
    data.subscribe(
      (data) => {
        this.getAllProducts(token);
        this.$loading.next(false);
      },
      (Err) => {
        if (Err.error === 'please enter id') {
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

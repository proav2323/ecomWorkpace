import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { order } from '../models/order';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  addOrder,
  baseUrl,
  getAllOrders,
  updateProduct,
} from '../utils/constants';
import { getDashbourdOrders } from '../utils/constants';
import { User } from '../models/user';
import { CartService } from './cart.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from './products.service';
import { product } from '../models/Product';
import { cart } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  $orders: BehaviorSubject<order[]> = new BehaviorSubject<order[]>([]);
  $dashbourdOrders: BehaviorSubject<{ data: order[]; day: Date }[]> =
    new BehaviorSubject<{ data: order[]; day: Date }[]>([]);
  $loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private httpClient: HttpClient,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar,
    private productsService: ProductsService
  ) {}

  getDashbourdOrders() {
    const data = this.httpClient.get<{
      success: boolean;
      data: { data: order[]; day: Date }[];
    }>(`${baseUrl}${getDashbourdOrders}`, {});
    data.subscribe(
      (data) => {
        this.$dashbourdOrders.next(data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getAllOrders(token: string) {
    const queryParams: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
    const data = this.httpClient.get<{
      success: boolean;
      data: order[];
    }>(`${baseUrl}${getAllOrders}`, {
      headers: queryParams,
    });
    data.subscribe(
      (data) => {
        this.$orders.next(data.data);
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  addOrder(
    address: {
      number?: number;
      road?: string;
      apartment?: string;
      postalCode: string;
    },
    cardDetails: {
      name: string;
      number: number;
      expireOn: string;
      cvv: number;
    },
    cart: cart,
    user: User,
    products: product[],
    $error: BehaviorSubject<string>
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this.$loading.next(true);
      const queryParams: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token,
      });
      const data = this.httpClient.post<{
        success: boolean;
        data: string;
      }>(
        `${baseUrl}${addOrder}`,
        {
          cart: cart,
          orderedBy: user._id,
          orderedOn: new Date(Date.now()).toString(),
          price: cart.totalPrice,
          paymentMethod: 'card',
          cardDetails: cardDetails,
          address: address,
          delivered: false,
          status: 'ordered',
        },
        { headers: queryParams }
      );
      data.subscribe(
        (data) => {
          let results: Observable<{
            success: boolean;
            data: string;
          }>[] = [];
          cart.cartItems.forEach((data) => {
            const item = products.find((pro) => pro._id === data.productId);
            if (item) {
              const result = this.httpClient.put<{
                success: boolean;
                data: string;
              }>(`${baseUrl}updateProductStock`, {
                id: data.productId,
                stock: item.stock - data.quantity,
              });
              results.push(result);
            }
          });
          let error: boolean[] = [];
          results.forEach((dsata) => {
            dsata.subscribe(
              (data) => {
                error.push(true);
              },
              (err) => {
                error.push(false);
              }
            );
          });
          error = error.filter((data) => data !== true);
          if (error.length > 0) {
            $error.next('error occured');
            this.$loading.next(false);
          } else {
            this.cartService.clearCart();
            this.$loading.next(false);
            this.snackBar.open('ordered placed', 'close');
            this.router.navigateByUrl('/');
          }
        },
        (Err) => {
          if (Err.error === 'please send full fields') {
            $error.next('fill the fields');
            this.$loading.next(false);
          } else if (Err.error === 'internal error') {
            $error.next('Internal Error');
            this.$loading.next(false);
          } else {
            $error.next('Internal Error');
            this.$loading.next(false);
          }
        }
      );
    }
  }
}

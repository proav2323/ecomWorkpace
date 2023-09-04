import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { order } from '../models/order';
import { BehaviorSubject } from 'rxjs';
import { baseUrl, getAllOrders } from '../utils/constants';
import { getDashbourdOrders } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  $orders: BehaviorSubject<order[]> = new BehaviorSubject<order[]>([]);
  $dashbourdOrders: BehaviorSubject<{ data: order[]; day: Date }[]> =
    new BehaviorSubject<{ data: order[]; day: Date }[]>([]);
  constructor(private httpClient: HttpClient) {}

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
}

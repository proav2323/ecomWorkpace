import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { order } from '../models/order';
import { BehaviorSubject } from 'rxjs';
import { baseUrl } from '../utils/constants';
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
}

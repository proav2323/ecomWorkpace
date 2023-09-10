import { Component } from '@angular/core';
import { AuthService, OrdersService, User, order } from 'ecomLib';

@Component({
  selector: 'app-users-orders',
  templateUrl: './users-orders.component.html',
  styleUrls: ['./users-orders.component.css'],
})
export class UsersOrdersComponent {
  orders: order[] = [];
  user: User | null = null;
  constructor(
    private ordersService: OrdersService,
    private authService: AuthService
  ) {
    this.ordersService.$orders.subscribe((data) => {
      this.orders = data;
    });
    this.authService.$user.subscribe((data) => {
      this.user = data;
      if (data) {
        this.ordersService.getUserOrders(data._id);
      }
    });
  }
}

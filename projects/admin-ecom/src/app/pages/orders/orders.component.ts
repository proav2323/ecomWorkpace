import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OrdersService, order } from 'ecomLib';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent {
  orders: order[] = [];
  statusNames = [
    { name: 'delivered', value: 'delivered' },
    { name: 'shipped', value: 'shipped' },
    { name: 'ordered', value: 'ordered' },
  ];
  constructor(private ordersService: OrdersService) {
    const token = localStorage.getItem('token');
    if (token) {
      this.ordersService.getAllOrders(token);
    }
    this.ordersService.$orders.subscribe((data) => {
      this.orders = data;
    });
  }
  change(order: order, E: any) {
    this.ordersService.updateOrder(order._id, E.checked, order.status);
  }
  delete(id: string) {
    this.ordersService.deleteOrder(id);
  }
}

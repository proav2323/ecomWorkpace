import { Component } from '@angular/core';
import { CartService, cart } from 'ecomLib';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cart!: cart | null;
  constructor(private cartService: CartService) {
    this.cartService.$cart.subscribe((data) => {
      this.cart = data;
    });
  }
}

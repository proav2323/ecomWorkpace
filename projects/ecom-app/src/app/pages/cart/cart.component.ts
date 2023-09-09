import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService, cart, product } from 'ecomLib';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cart!: cart | null;
  products: product[] = [];
  constructor(
    private cartService: CartService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.cartService.$cart.subscribe((data) => {
      this.cart = data;
    });
  }
  addProduct(product: product) {
    this.products.push(product);
    console.log(product);
  }
  navigetToCheckout() {
    if (this.cart !== null) {
      if (this.cart.cartItems.length > 0) {
        let success: boolean[] = [];
        this.cart.cartItems.forEach((data) => {
          const item = this.products.find((pro) => pro._id === data.productId);
          if (item) {
            if (item.stock > data.quantity) {
              success.push(true);
            } else {
              success.push(false);
            }
          } else {
            success.push(false);
          }
        });
        success = success.filter((bool) => bool !== true);
        if (success.length > 0) {
          this.snackbar.open(
            "can't checkout product stock in not avaiblable or no item in the cart",
            'close'
          );
        } else {
          this.router.navigateByUrl('/checkout');
        }
      } else {
        this.snackbar.open('no item in the cart', 'close');
      }
    }
  }
}

import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService, ProductsService, product } from 'ecomLib';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: product;
  @Input() category?: string;
  cartLoading!: boolean;
  constructor(
    private cartService: CartService,
    private proeductService: ProductsService,
    private snackbar: MatSnackBar
  ) {
    this.cartService.$cartLoading.subscribe((data) => {
      this.cartLoading = data;
    });
  }
  addToCart() {
    if (this.product.stock >= 1) {
      this.cartService.addItemToCart(
        this.product._id,
        1,
        this.product.price,
        this.product,
        this.category
      );
    } else {
      this.snackbar.open('currenlty out of stock', 'close');
    }
  }
}

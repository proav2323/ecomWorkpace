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
  cartLoading!: boolean;
  constructor(
    private cartService: CartService,
    private proeductService: ProductsService,
    private snackbar: MatSnackBar
  ) {}
  addToCart() {
    if (this.product.stock >= 1) {
      this.cartService.addItemToCart(
        this.product._id,
        1,
        this.product.price,
        this.product
      );
    } else {
      this.snackbar.open('currenlty out of stock');
    }
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService, ProductsService, cartItem, product } from 'ecomLib';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
})
export class CartItemComponent implements OnInit {
  @Input() cartItem!: cartItem;
  cartItemProduct!: product;
  @Output() productFun: EventEmitter<product> = new EventEmitter();

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private snackbar: MatSnackBar
  ) {}
  ngOnInit() {
    this.productsService
      .getSingleProductWithReturn(this.cartItem.productId)
      .subscribe((data) => {
        this.cartItemProduct = data.data;
        this.productFun.emit(this.cartItemProduct);
      });
  }
  updateQuanityt(value: number, doing: string) {
    if (this.cartItemProduct.stock >= 1) {
      if (doing === 'sub' && this.cartItem.quantity > 1) {
        this.cartService.updateItemFromCart(
          this.cartItemProduct._id,
          value,
          this.cartItemProduct,
          'sub'
        );
      } else if (doing === 'add') {
        this.cartService.updateItemFromCart(
          this.cartItemProduct._id,
          value,
          this.cartItemProduct,
          'add'
        );
      }
    } else {
      this.snackbar.open('currenlty out of stock', 'close');
    }
  }
  removeItem() {
    this.cartService.removeItemFromCart(
      this.cartItemProduct._id,
      this.cartItemProduct
    );
  }
}

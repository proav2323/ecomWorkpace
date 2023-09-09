import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AuthService,
  CartService,
  OrdersService,
  ProductsService,
  User,
  cart,
  product,
} from 'ecomLib';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  cart: cart | null = null;
  $error: BehaviorSubject<string> = new BehaviorSubject('');
  error: string = '';
  loading: boolean = false;
  products: product[] = [];
  user: User | null = null;
  constructor(
    private cartService: CartService,
    private orderService: OrdersService,
    private productsService: ProductsService,
    private authService: AuthService
  ) {
    this.cartService.$cart.subscribe((data) => {
      this.cart = data;
      if (data) {
        data.cartItems.forEach((data) => {
          const dataR = this.productsService.getSingleProductWithReturn(
            data.productId
          );
          dataR.subscribe((data) => {
            this.products.push(data.data);
          });
        });
      }
    });
    this.cartService.$cartLoading.subscribe((data) => {
      this.loading = data;
    });
    this.$error.subscribe((data) => {
      this.error = data;
    });
    this.authService.$user.subscribe((data) => {
      this.user = data;
    });
  }
  formGroup: FormGroup = new FormGroup({
    number: new FormControl(''),
    road: new FormControl(''),
    apartment: new FormControl(''),
    postalCode: new FormControl('', [Validators.required]),
    cardName: new FormControl('', [Validators.required]),
    cardNumber: new FormControl('', [Validators.required]),
    expiresOn: new FormControl('', [Validators.required]),
    cvv: new FormControl('', [Validators.required]),
  });

  checkOut() {
    if (this.formGroup.valid) {
      const address: {
        number?: number;
        road?: string;
        apartment?: string;
        postalCode: string;
      } = {
        number: this.formGroup.controls['number'].value,
        road: this.formGroup.controls['road'].value,
        apartment: this.formGroup.controls['apartment'].value,
        postalCode: this.formGroup.controls['postalCode'].value!,
      };

      const cardDetaiils: {
        name: string;
        number: number;
        expireOn: string;
        cvv: number;
      } = {
        name: this.formGroup.controls['cardName'].value! as string,
        number: this.formGroup.controls['cardNumber'].value! as number,
        expireOn: this.formGroup.controls['expiresOn'].value! as string,
        cvv: this.formGroup.controls['cvv'].value! as number,
      };
      this.orderService.addOrder(
        address,
        cardDetaiils,
        this.cart!,
        this.user!,
        this.products,
        this.$error
      );
    } else {
      this.$error.next('fill the fields');
    }
  }
}

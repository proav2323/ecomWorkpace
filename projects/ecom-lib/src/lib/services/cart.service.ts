import { product } from './../models/Product';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cart } from '../models/cart';
import { cartItem } from '../models/cartItms';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  $cart: BehaviorSubject<cart | null> = new BehaviorSubject(
    JSON.parse(JSON.stringify(localStorage.getItem('cart'))) ?? null
  );
  constructor(private productsService: ProductsService) {}

  addItemToCart(
    productId: string,
    quanitit: number,
    price: number,
    product: product
  ) {
    if (this.$cart.getValue() !== null && this.$cart.getValue() !== undefined) {
      const oldCart = this.$cart.getValue()!;
      const item = oldCart.cartItems.find(
        (data) => data.productId === productId
      );
      if (item === undefined) {
        const items: cartItem[] = [];
        let totalPrice: number = 0;
        let totalQty = 0;
        oldCart.cartItems.forEach((data) => {
          items.push(data);
        });
        const newItem = new cartItem(productId, quanitit, price);
        items.push(newItem);
        items.forEach((data) => {
          totalPrice += data.price * data.quantity;
          totalQty += data.quantity;
        });
        const newCart = new cart(totalPrice, items, totalQty);
        this.$cart.next(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        console.log(cart);
      } else {
        this.updateItemFromCart(item.productId, item.quantity + 1, product);
      }
    } else {
      const items: cartItem[] = [];
      let totalPrice: number = 0;
      let totalQty = 0;
      const newItem = new cartItem(productId, quanitit, price);
      items.push(newItem);
      items.forEach((data) => {
        totalPrice += data.price * data.quantity;
        totalQty += data.quantity;
      });
      const newCart = new cart(totalPrice, items, totalQty);
      this.$cart.next(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      console.log(cart);
    }
  }

  removeItemFromCart(productId: string, product: product) {
    if (this.$cart.getValue() !== null && this.$cart.getValue() !== undefined) {
      const oldCart = this.$cart.getValue()!;
      const items: cartItem[] = [];
      let totalPrice = 0;
      let totalQty = 0;
      const newItems = oldCart.cartItems.filter(
        (data) => data.productId !== productId
      );
      newItems.forEach((data) => {
        items.push(data);
      });
      items.forEach((data) => {
        totalPrice += data.price * data.quantity;
        totalQty += data.quantity;
      });
      const newCart = new cart(totalPrice, items, totalQty);
      this.$cart.next(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      console.log(cart);
    }
  }

  updateItemFromCart(productId: string, qty: number, product: product) {
    if (this.$cart.getValue() !== null && this.$cart.getValue() !== undefined) {
      const oldCart = this.$cart.getValue()!;
      const items: cartItem[] = [];
      let totalPrice = 0;
      let totalQty = 0;
      const index = oldCart.cartItems.findIndex(
        (data) => data.productId === productId
      );
      oldCart.cartItems[index].quantity = qty;
      oldCart.cartItems.forEach((data) => {
        items.push(data);
      });
      items.forEach((data) => {
        totalPrice += data.price * data.quantity;
        totalQty += data.quantity;
      });
      const newCart = new cart(totalPrice, items, totalQty);
      this.$cart.next(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      console.log(cart);
    }
  }
}

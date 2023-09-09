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
  cart: string | null = localStorage.getItem('cart');
  $cart: BehaviorSubject<cart | null>;
  $cartLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private productsService: ProductsService) {
    if (this.cart) {
      this.$cart = new BehaviorSubject(JSON.parse(this.cart));
    } else {
      this.$cart = new BehaviorSubject<cart | null>(null);
    }
  }

  addItemToCart(
    productId: string,
    quanitit: number,
    price: number,
    product: product,
    categoryName?: string
  ) {
    this.$cartLoading.next(true);
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
        this.$cartLoading.next(false);
      } else {
        this.updateItemFromCart(
          item.productId,
          item.quantity + quanitit,
          product,
          'add',
          categoryName
        );
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
      this.$cartLoading.next(false);
    }
  }

  removeItemFromCart(
    productId: string,
    product: product,
    categoryName?: string
  ) {
    if (this.$cart.getValue() !== null && this.$cart.getValue() !== undefined) {
      this.$cartLoading.next(true);
      const oldCart = this.$cart.getValue()!;
      const items: cartItem[] = [];
      let totalPrice = 0;
      let totalQty = 0;
      const item = oldCart.cartItems.find(
        (data) => data.productId === productId
      );
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
      this.$cartLoading.next(false);
    }
  }

  updateItemFromCart(
    productId: string,
    qty: number,
    product: product,
    doing: string,
    categoryName?: string
  ) {
    if (this.$cart.getValue() !== null && this.$cart.getValue() !== undefined) {
      this.$cartLoading.next(true);
      const oldCart = this.$cart.getValue()!;
      const items: cartItem[] = [];
      let totalPrice = 0;
      let totalQty = 0;
      const index = oldCart.cartItems.findIndex(
        (data) => data.productId === productId
      );
      const prevQty = oldCart.cartItems[index].quantity;
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
    this.$cartLoading.next(false);
  }
  clearCart() {
    localStorage.removeItem('cart');
    this.$cart.next(null);
  }
}

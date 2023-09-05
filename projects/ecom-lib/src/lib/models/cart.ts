import { cartItem } from './cartItms';

export class cart {
  totalPrice: number;
  totalQty: number;
  cartItems: cartItem[];
  constructor(price: number, cartItems: cartItem[], qty: number) {
    this.totalPrice = price;
    this.totalQty = qty;
    this.cartItems = cartItems;
  }
}

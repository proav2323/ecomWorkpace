import { cartItem } from './cartItms';

export interface cart {
  totalPrice: number;
  totalQty: number;
  cartItems: cartItem[];
}

import { product } from './Product';
import { cart } from './cart';

export interface order {
  cart: cart;
  orderedBy: string;
  orderedOn: Date;
  price: number;
  paymentMethod: string;
  cardDetails: {
    name: string;
    number: number;
    expireOn: string;
    cvv: number;
  };
  address: {
    number?: number;
    road?: string;
    apartment?: string;
    postalCode: string;
  };
  delivered: boolean;
  status: string;
  _id: string;
}

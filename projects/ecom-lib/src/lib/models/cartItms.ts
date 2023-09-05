export class cartItem {
  quantity: number;
  productId: string;
  price: number;

  constructor(id: string, qty: number, price: number) {
    this.quantity = qty;
    this.productId = id;
    this.price = price;
  }
}

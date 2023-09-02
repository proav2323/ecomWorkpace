export interface User {
  email: string;
  name: string;
  imgUrl: string;
  role: string;
  password: string;
  wishlist: { productId: string }[];
  _id: string;
}

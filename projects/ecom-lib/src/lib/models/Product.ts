import { reviews } from './reviews';

export interface product {
  name: string;
  _id: string;
  images: string[];
  description: string;
  createdOn: Date;
  price: number;
  category: string;
  reviews: reviews[];
  stock: number;
  isBanner: boolean;
  bannerText: string;
}

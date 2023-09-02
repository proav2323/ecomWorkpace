export interface product {
  name: string;
  images: string[];
  description: string;
  createdOn: Date;
  price: number;
  category: string;
  reviews: {
    createdBy: string;
    text: string;
    createdOn: Date;
    stars: number;
  }[];
  stock: number;
}

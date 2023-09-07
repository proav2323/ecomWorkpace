import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {
  AuthService,
  CartService,
  ProductsService,
  User,
  product,
  reviews,
} from 'ecomLib';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  id: string = '';
  imgIndex: number = 0;
  $imgIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  product: product | null = null;
  ratings: number[] = [];
  user!: User | null;
  reviewNum!: number;
  reviewText: string = '';
  $reviewNum: BehaviorSubject<number> = new BehaviorSubject(0);
  reviewsData = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ];
  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {
    this.$reviewNum.subscribe((data) => {
      this.reviewNum = data;
    });
    this.route.queryParams.subscribe((data) => {
      if (data['id']) {
        this.id = data['id'];
        this.productsService.getSingleProduct(this.id);
        this.productsService.$singleProduct.subscribe((data) => {
          this.product = data;
          if (data !== null) {
            this.ratings = Array(data.ratings);
          }
        });
      }
    });
    this.authService.$user.subscribe((data) => {
      this.user = data;
    });
    this.$imgIndex.subscribe((data) => {
      this.imgIndex = data;
    });
  }
  addToCart() {
    if (this.product !== null) {
      if (this.product.stock >= 1) {
        this.cartService.addItemToCart(
          this.product._id,
          1,
          this.product.price,
          this.product
        );
      } else {
        this.snackbar.open('currenlty out of stock', 'close');
      }
    }
  }
  changeValue(i: number) {
    this.$imgIndex.next(i);
  }
  changeReviewNum(i: number) {
    this.$reviewNum.next(i);
  }
  addReview() {
    if (this.product !== null && this.user !== null && this.reviewText !== '') {
      const newReview = this.product.reviews;
      let totalStars: number = 0;
      const data: reviews = {
        createdBy: this.user._id,
        text: this.reviewText,
        createdOn: new Date(Date.now()),
        stars: this.reviewNum,
      };
      newReview.push(data);
      newReview.forEach((data) => {
        totalStars += data.stars;
      });
      const ratings = totalStars / newReview.length;
      this.productsService.updateProduct(
        this.product._id,
        this.product.name,
        this.product.description,
        this.product.images,
        this.product.price,
        this.product.category,
        ratings,
        newReview,
        this.product.stock,
        new BehaviorSubject<string>(''),
        this.product.isBanner,
        this.product.bannerText
      );
    }
  }
}

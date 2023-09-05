import { Component } from '@angular/core';
import {
  CategoriesService,
  ProductsService,
  categories,
  product,
} from 'ecomLib';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  bannerProduct: product | null = null;
  token = localStorage.getItem('token');
  $bannerText: BehaviorSubject<string> = new BehaviorSubject('');
  categories: categories[] = [];
  constructor(
    private productService: ProductsService,
    private CategoryService: CategoriesService
  ) {
    this.productService.$bannerProduct.subscribe((data) => {
      this.bannerProduct = data;
    });
    this.CategoryService.$Categories.subscribe((data) => {
      this.categories = data;
    });
    this.productService.getBannerProduct();
    if (this.token) {
      this.CategoryService.getAllCategories(this.token);
    }
  }
}

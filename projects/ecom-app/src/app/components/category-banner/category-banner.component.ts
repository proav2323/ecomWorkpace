import { Component } from '@angular/core';
import {
  CategoriesService,
  ProductsService,
  categories,
  product,
} from 'ecomLib';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-category-banner',
  templateUrl: './category-banner.component.html',
  styleUrls: ['./category-banner.component.css'],
})
export class CategoryBannerComponent {
  products: product[] = [];
  categories: categories[] = [];
  token = localStorage.getItem('token');
  $categoryName: BehaviorSubject<string> = new BehaviorSubject('');
  categoryName: string = '';
  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ) {
    this.productsService.$categoryProducts.subscribe((data) => {
      this.products = data;
    });
    this.categoriesService.$Categories.subscribe((data) => {
      this.categories = data;
    });
    if (this.token) {
      this.categoriesService.getAllCategories(this.token);
    }
    this.getCategoryProducts('all');
    this.$categoryName.subscribe((data) => {
      this.categoryName = data;
    });
  }
  getCategoryProducts(category: string) {
    this.productsService.getCategoryProducts(category);
    this.$categoryName.next(category);
  }
}

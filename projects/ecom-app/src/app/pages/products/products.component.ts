import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, product } from 'ecomLib';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  products: product[] = [];
  category!: string;
  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data['category']) {
        this.category = data['category'];
        if (data['category'] !== 'all') {
          this.productsService.$categoryProducts.subscribe((data) => {
            this.products = data;
          });
          this.productsService.getCategoryProducts(data['category']);
        } else {
          this.productsService.$product.subscribe((data) => {
            this.products = data;
          });
          this.productsService.getAllProducts();
        }
      }
    });
  }
}

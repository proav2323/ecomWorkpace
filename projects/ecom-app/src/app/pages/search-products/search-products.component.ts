import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, product } from 'ecomLib';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.css'],
})
export class SearchProductsComponent {
  products: product[] = [];
  search!: string;
  constructor(
    private route: ActivatedRoute,
    private productSrvice: ProductsService
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data['search']) {
        this.productSrvice.getSearchProducts(data['search']);
        this.search = data['search'];
        this.productSrvice.$product.subscribe((data) => {
          this.products = data;
        });
      }
    });
  }
}

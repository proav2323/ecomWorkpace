import { Component } from '@angular/core';
import { ProductsService, product } from 'ecomLib';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  products: product[] = [];
  constructor(private productsService: ProductsService) {
    this.productsService.$product.subscribe((data) => {
      this.products = data;
    });
    const token = localStorage.getItem('token');
    if (token) {
      this.productsService.getAllProducts();
    }
  }
  delete(id: string) {
    const token = localStorage.getItem('token');
    if (token) {
      this.productsService.deleteCategory(id, token);
    }
  }
}

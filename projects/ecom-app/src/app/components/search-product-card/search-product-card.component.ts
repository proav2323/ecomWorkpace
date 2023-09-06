import { Component, Input } from '@angular/core';
import { product } from 'ecomLib';

@Component({
  selector: 'app-search-product-card',
  templateUrl: './search-product-card.component.html',
  styleUrls: ['./search-product-card.component.css'],
})
export class SearchProductCardComponent {
  @Input() product!: product;
}

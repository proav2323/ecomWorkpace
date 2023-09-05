import { Component, Input } from '@angular/core';
import { product } from 'ecomLib';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent {
  @Input() banner!: product;
}

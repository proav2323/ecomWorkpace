import { categories } from './../../../../../ecom-lib/src/lib/models/categories';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, CategoriesService, ProductsService } from 'ecomLib';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  images: string[] = [];
  loading!: boolean;
  categories: categories[] = [];
  imgLoading!: boolean;
  $error: BehaviorSubject<string> = new BehaviorSubject('');
  error!: string;
  token = localStorage.getItem('token');
  isBanner: boolean = false;
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    stock: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    bannerText: new FormControl('', [Validators.required]),
  });
  constructor(
    private authService: AuthService,
    private CategoriesService: CategoriesService,
    private ProductsService: ProductsService
  ) {
    this.authService.$imgLoding.subscribe((data) => {
      this.imgLoading = data;
    });
    this.ProductsService.$loading.subscribe((data) => {
      this.loading = data;
    });
    this.$error.subscribe((data) => {
      this.error = data;
    });
    this.CategoriesService.$Categories.subscribe((data) => {
      this.categories = data;
    });
    if (this.token) {
      this.CategoriesService.getAllCategories(this.token);
    }
  }
  uploadImage(e: any) {
    const file = e.target.files[0];
    const img = new BehaviorSubject<string>('');
    this.authService.uploadImage(file, img, this.$error);
    img.subscribe((data) => {
      if (data !== '') {
        this.images.push(data);
      }
      img.next('');
    });
  }
  removeImg(img: string) {
    this.images = [...this.images].filter((i) => i !== img);
  }
  addProduct() {
    if (this.formGroup.valid) {
      if (this.images.length !== 0) {
        if (this.token) {
          const name = this.formGroup.controls['name'];
          const stock = this.formGroup.controls['stock'];
          const price = this.formGroup.controls['price'];
          const description = this.formGroup.controls['description'];
          const category = this.formGroup.controls['category'];
          console.log(category);
          this.ProductsService.addProduct(
            this.token,
            name.value!,
            this.images,
            description.value!,
            price.value!,
            category.value!,
            stock.value!,
            this.$error,
            this.isBanner,
            this.formGroup.controls['bannerText'].value!
          );
        }
      } else {
        this.$error.next('choose images fo product first');
      }
    } else {
      this.$error.next('fill the fields first');
    }
  }
}

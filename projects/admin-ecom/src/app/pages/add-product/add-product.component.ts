import { categories } from './../../../../../ecom-lib/src/lib/models/categories';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AuthService,
  CategoriesService,
  ProductsService,
  product,
} from 'ecomLib';
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
  id: string = '';
  token = localStorage.getItem('token');
  isBanner = false;
  product!: product | null;
  $formGroup: BehaviorSubject<FormGroup> = new BehaviorSubject(
    new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      stock: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      bannerText: new FormControl('', [Validators.required]),
    })
  );
  formGroup!: FormGroup;
  update!: boolean;
  $update: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private authService: AuthService,
    private CategoriesService: CategoriesService,
    private ProductsService: ProductsService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data['update'] && data['id']) {
        this.$update.next(true);
        this.id = data['id'];
        const dataR = this.ProductsService.getSingleProductWithReturn(
          data['id']
        );
        dataR.subscribe((data) => {
          this.product = data.data;
          this.$formGroup.next(
            new FormGroup({
              name: new FormControl(data.data.name, [Validators.required]),
              description: new FormControl(data.data.description, [
                Validators.required,
              ]),
              stock: new FormControl(data.data.stock, [Validators.required]),
              price: new FormControl(data.data.price, [Validators.required]),
              category: new FormControl(data.data.category, [
                Validators.required,
              ]),
              bannerText: new FormControl(data.data.bannerText, [
                Validators.required,
              ]),
            })
          );
          this.images = data.data.images;
          this.isBanner = data.data.isBanner;
        });
      }
    });
    this.$formGroup.subscribe((data) => {
      this.formGroup = data;
    });
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
    this.$update.subscribe((data) => {
      this.update = data;
    });
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
    if (this.update) {
      if (this.formGroup.valid) {
        if (this.images.length !== 0) {
          if (this.token) {
            const name = this.formGroup.controls['name'];
            const stock = this.formGroup.controls['stock'];
            const price = this.formGroup.controls['price'];
            const description = this.formGroup.controls['description'];
            const category = this.formGroup.controls['category'];
            console.log(category);
            this.ProductsService.updateProduct(
              this.id,
              name.value!,
              description.value!,
              this.images,
              price.value!,
              category.value!,
              this.product?.ratings!,
              this.product?.reviews!,
              stock.value!,
              this.$error,
              this.isBanner,
              this.formGroup.controls['bannerText'].value!
            );
          } else {
            this.$error.next('choose images fo product first');
          }
        } else {
          this.$error.next('fill the fields first');
        }
      }
    } else {
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
  setValue(e: any) {
    this.isBanner = e.checked;
  }
}

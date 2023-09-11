import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AuthService, CategoriesService, categories } from 'ecomLib';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent {
  $error: BehaviorSubject<string> = new BehaviorSubject('');
  error!: string;
  $imgUrl: BehaviorSubject<string> = new BehaviorSubject('');
  imgUrl!: string;
  categoryName: string = '';
  loading!: boolean;
  imgLoaidng!: boolean;
  update!: boolean;
  $update: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private CategoryService: CategoriesService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public data: { update: boolean; category: null | categories }
  ) {
    if (data.update && data.category) {
      this.$imgUrl.next(data.category?.imgUrl!);
      this.categoryName = data.category?.name!;
      this.$update.next(true);
    }
    this.$update.subscribe((data) => {
      this.update = data;
    });
    this.$error.subscribe((data) => {
      this.error = data;
    });
    this.$imgUrl.subscribe((data) => {
      this.imgUrl = data;
    });
    this.authService.$imgLoding.subscribe((dsata) => {
      this.imgLoaidng = dsata;
    });
    this.CategoryService.$loading.subscribe((data) => {
      this.loading = data;
    });
  }

  uploadImage(e: any) {
    const file = e.target.files[0];
    this.authService.uploadImage(file, this.$imgUrl, this.$error);
  }
  addCategory() {
    const token = localStorage.getItem('token');
    if (this.update && this.data.category) {
      if (this.categoryName !== '' && this.imgUrl !== '' && token) {
        this.CategoryService.updateCategories(
          this.data.category._id,
          this.categoryName,
          this.imgUrl,
          this.$error,
          token
        );
      }
    } else {
      if (this.categoryName !== '' && this.imgUrl !== '' && token) {
        this.CategoryService.addCategories(
          this.categoryName,
          this.imgUrl,
          this.$error,
          token
        );
      } else if (this.categoryName === '') {
        this.$error.next('fill the fields');
      } else {
        this.$error.next('choose a image');
      }
    }
  }
}

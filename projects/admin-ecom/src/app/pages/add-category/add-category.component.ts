import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AuthService, CategoriesService } from 'ecomLib';
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
  constructor(
    private CategoryService: CategoriesService,
    private authService: AuthService
  ) {
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

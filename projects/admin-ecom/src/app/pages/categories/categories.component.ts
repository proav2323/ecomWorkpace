import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { AuthService, CategoriesService, categories } from 'ecomLib';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent {
  categories: categories[] = [];
  constructor(
    private categoryService: CategoriesService,
    private dailog: MatDialog
  ) {
    this.categoryService.$Categories.subscribe((data) => {
      this.categories = data;
    });
    const token = localStorage.getItem('token');
    if (token) {
      this.categoryService.getAllCategories(token);
    }
  }

  opneDialog() {
    if (window.innerWidth > 650) {
      this.dailog.open(AddCategoryComponent, {
        width: `${(window.innerWidth - 300).toString()}px`,
        height: `${(window.innerHeight - 300).toString()}px`,
      });
    } else {
      this.dailog.open(AddCategoryComponent, {
        width: `${(window.innerWidth - 100).toString()}px`,
        height: `${(window.innerHeight - 100).toString()}px`,
      });
    }
  }
  delete(id: string) {
    const token = localStorage.getItem('token');
    if (token) {
      this.categoryService.deleteCategory(id, token);
    }
  }
}

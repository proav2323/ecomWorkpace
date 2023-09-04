import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { categories } from '../models/categories';
import { HttpClient } from '@angular/common/http';
import {
  addCategories,
  baseUrl,
  getAllCategories,
  updateCategories,
} from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  $Categories: BehaviorSubject<categories[]> = new BehaviorSubject<
    categories[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  getAllCategories() {
    const data = this.httpClient.get<{ success: boolean; data: categories[] }>(
      `${baseUrl}${getAllCategories}`
    );
    data.subscribe(
      (data) => {
        this.$Categories.next(data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addCategories(name: string, imgUrl: string, error: BehaviorSubject<string>) {
    const data = this.httpClient.post(`${baseUrl}${addCategories}`, {
      name: name,
      imgUrl: imgUrl,
    });
    data.subscribe(
      (data) => {
        console.log('added');
        this.getAllCategories();
      },
      (err) => {
        if (err.error === 'send values') {
          error.next('fill the fields first');
        } else if (err.error === 'internal error') {
          error.next('internal error');
        } else {
          error.next('internal error');
        }
      }
    );
  }

  updateCategories(
    id: string,
    name: string,
    imgUrl: string,
    error: BehaviorSubject<string>
  ) {
    const data = this.httpClient.put(`${baseUrl}${updateCategories}/${id}`, {
      name: name,
      imgUrl: imgUrl,
    });
    data.subscribe(
      (data) => {
        console.log('updated');
        this.getAllCategories();
      },
      (err) => {
        if (err.error === 'send values') {
          error.next('fill the fields first');
        } else if (err.error === 'internal error') {
          error.next('internal error');
        } else {
          error.next('internal error');
        }
      }
    );
  }
}

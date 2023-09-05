import { ProductsComponent } from './pages/products/products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbourdComponent } from './pages/dashbourd/dashbourd.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { AddCategoryComponent } from './pages/add-category/add-category.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { AdminnGuard, LoginComponent, LoginGuard } from 'ecomLib';

const routes: Routes = [
  { path: '', component: DashbourdComponent, canActivate: [AdminnGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AdminnGuard],
  },
  {
    path: 'addProduct',
    component: AddProductComponent,
    canActivate: [AdminnGuard],
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AdminnGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

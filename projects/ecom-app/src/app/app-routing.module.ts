import { ProductsComponent } from './pages/products/products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {
  AdminnGuard,
  LoginComponent,
  LoginGuard,
  RegisterComponent,
} from 'ecomLib';
import { SearchProductsComponent } from './pages/search-products/search-products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'signUp', component: RegisterComponent, canActivate: [LoginGuard] },
  { path: 'products', component: ProductsComponent },
  { path: 'search', component: SearchProductsComponent },
  { path: 'productDetails', component: ProductDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

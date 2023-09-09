import { ProductsComponent } from './pages/products/products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {
  AdminnGuard,
  LoginComponent,
  LoginGuard,
  RegisterComponent,
  UserGuard,
} from 'ecomLib';
import { SearchProductsComponent } from './pages/search-products/search-products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'signUp', component: RegisterComponent, canActivate: [LoginGuard] },
  { path: 'products', component: ProductsComponent },
  { path: 'search', component: SearchProductsComponent },
  { path: 'productDetails', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [UserGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

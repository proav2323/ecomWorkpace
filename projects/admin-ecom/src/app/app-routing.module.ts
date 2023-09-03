import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbourdComponent } from './pages/dashbourd/dashbourd.component';
import { LoginComponent, LoginGuard } from 'ecomLib';
import { AdminnGuard } from 'ecomLib';

const routes: Routes = [
  { path: '', component: DashbourdComponent, canActivate: [AdminnGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

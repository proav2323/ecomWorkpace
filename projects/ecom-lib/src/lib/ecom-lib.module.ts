import { NgModule } from '@angular/core';
import { EcomLibComponent } from './ecom-lib.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { InputComponent } from './components/input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    EcomLibComponent,
    LoginComponent,
    RegisterComponent,
    InputComponent,
  ],
  imports: [FormsModule, ReactiveFormsModule, MatProgressSpinnerModule],
  exports: [EcomLibComponent],
})
export class EcomLibModule {}

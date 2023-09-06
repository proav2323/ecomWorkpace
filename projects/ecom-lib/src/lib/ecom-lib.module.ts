import { NgModule } from '@angular/core';
import { EcomLibComponent } from './ecom-lib.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { InputComponent } from './components/input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    EcomLibComponent,
    LoginComponent,
    RegisterComponent,
    InputComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientJsonpModule,
    HttpClientModule,
    MatIconModule,
  ],
  exports: [EcomLibComponent],
})
export class EcomLibModule {}

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private authService: AuthService, private snackbar: MatSnackBar) {
    this.$error.subscribe((data) => {
      this.error = data;
    });
    this.authService.$loading.subscribe((data) => {
      this.loading = data;
    });
  }
  error!: string;
  loading!: boolean;
  $error: BehaviorSubject<string> = new BehaviorSubject('');
  login() {
    const emailText = this.formGroup.controls['email'];
    const passwordText = this.formGroup.controls['password'];
    if (emailText.hasError('email')) {
      this.$error.next('not a valid email');
    } else if (emailText.hasError('required')) {
      this.$error.next('Please enter your Email');
    } else if (passwordText.hasError('required')) {
      this.$error.next('Password is required');
    } else {
      this.authService.login(
        emailText.value!,
        passwordText.value!,
        this.$error
      );
    }
  }
  formGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  chnageRoute(route: string) {
    this.authService.chnageRoute(route);
  }
}

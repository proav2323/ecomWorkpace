import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lib-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private AuthService: AuthService) {
    this.AuthService.$loading.subscribe((data) => {
      this.loading = data;
    });
    this.AuthService.$imgLoding.subscribe((data) => {
      this.imgLoading = data;
    });
    this.$error.subscribe((data) => {
      this.error = data;
    });
    this.$imgUrl.subscribe((data) => {
      this.imgUrl = data;
    });
  }
  loading!: boolean;
  imgLoading!: boolean;
  error!: string;
  imgUrl!: string;
  $imgUrl: BehaviorSubject<string> = new BehaviorSubject('');
  $error: BehaviorSubject<string> = new BehaviorSubject('');
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });
  signUp() {
    const emailText = this.formGroup.controls.email;
    const passwordText = this.formGroup.controls.password;
    const nameText = this.formGroup.controls.name;
    if (emailText.hasError('email')) {
      this.$error.next('email is not valid');
    } else if (emailText.hasError('required')) {
      this.$error.next('email is required');
    } else if (passwordText.hasError('required')) {
      this.$error.next('Password field cannot be empty');
    } else if (nameText.hasError('required')) {
      this.$error.next('Name Field Cannot Be Empty');
    } else if (this.imgUrl === '') {
      this.$error.next('please choose a profile photo before contining');
    } else {
      this.AuthService.signUp(
        nameText.value!,
        emailText.value!,
        passwordText.value!,
        this.imgUrl,
        this.$error
      );
    }
  }
  uploadImage(event: any) {
    const file = event.target.files[0];
    this.AuthService.uploadImage(file, this.$imgUrl, this.$error);
  }
  chnageRoute(route: string) {
    this.AuthService.chnageRoute(route);
  }
}

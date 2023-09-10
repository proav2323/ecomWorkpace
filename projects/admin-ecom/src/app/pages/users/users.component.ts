import { Component } from '@angular/core';
import { User, AuthService } from 'ecomLib';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  users: User[] = [];
  constructor(private AuthService: AuthService) {
    const data = this.AuthService.getAllUsers();
    data.subscribe((data) => {
      this.users = data.data;
    });
  }
  delete(id: string) {
    this.AuthService.deleteUser(id);
  }
  change(user: User, e: any) {
    this.AuthService.updateUser(
      user._id,
      user.name,
      e.checked === true ? 'admin' : 'user',
      user.imgUrl,
      user.imgUrl,
      user.wishlist
    );
  }
}

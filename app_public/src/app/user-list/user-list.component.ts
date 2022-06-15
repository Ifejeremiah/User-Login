import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private title: Title
  ) {
    title.setTitle('Demo - Users')
    this.userService.getUsers().subscribe(data => this.users = data.data)
  }

  users: any

  doLogout() { this.authService.logout() }

}

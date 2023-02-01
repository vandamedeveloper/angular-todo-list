import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { User } from 'src/app/shared/users/data-access/model/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() user: User;

  constructor(private authService: AuthService, private _router: Router) {}
  logout() {
    this.authService.logout();
    this._router.navigate(['auth']);
  }
}

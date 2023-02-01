import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/users/data-access/api/user.service';
import { User } from 'src/app/shared/users/data-access/model/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private _fBuilder: FormBuilder,
    private _authService: AuthService,
    private usersService: UserService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._initializeForm();
  }

  _initializeForm() {
    this.loginForm = this._fBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.required]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const email = this.loginForm.controls['email'].value;
      const password = this.loginForm.controls['password'].value;
      this.usersService.loginUser(email, password).subscribe(
        (user: User) => {
          this._authService.setToken(user['token']);
          console.log('user: ', user);
          this._router.navigate(['']);
        },
        (error) => {
          this._router.navigate(['auth']);
        }
      );
    }
  }
}

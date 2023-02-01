import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/users/data-access/api/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  registerForm: FormGroup;

  constructor(
    private _fBuilder: FormBuilder,
    private _authService: AuthService,
    private _userService: UserService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._initializeForm();
  }

  _initializeForm() {
    this.registerForm = this._fBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.required]],
      repeatPassword: ['', [Validators.required, Validators.required]],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const username = this.registerForm.controls['username'].value;
      const email = this.registerForm.controls['email'].value;
      const password = this.registerForm.controls['password'].value;
      const repeatPassword = this.registerForm.controls['password'].value;
      if (password == repeatPassword) {
        if (!this.registerForm.valid) return;
        this._userService.register(username, email, password).subscribe(
          (res) => {
            this._authService.setToken(res['token']);
            this._router.navigate(['']);
          },
          () => {
            console.log('error');
          }
        );
      } else {
        console.log("passwords don't match");
      }
    } else {
      console.log(this.registerForm);
    }
  }
}

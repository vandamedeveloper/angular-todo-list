import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TokenGuard implements CanActivate {
  constructor(private _router: Router, private _authService: AuthService) {}
  canActivate() {
    if (this._authService.getToken() == null) {
      this._router.navigate(['auth']);
      return false;
    } else {
      return true;
    }
  }
}

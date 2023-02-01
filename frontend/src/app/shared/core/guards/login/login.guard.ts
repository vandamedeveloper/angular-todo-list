import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private _router: Router, private _authService: AuthService) {}

  canActivate(): Observable<boolean> {
    if (this._authService.getToken() == null) {
      return of(true);
    } else {
      this._router.navigate(['']);
      return of(false);
    }
  }
}

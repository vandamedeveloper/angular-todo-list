import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { UserService } from 'src/app/shared/users/data-access/api/user.service';
import { UserManagerService } from '../../services/user-manager.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(
    private _usersService: UserService,
    private _router: Router,
    private _userManagerService: UserManagerService,
    private _authService: AuthService
  ) {}
  canActivate(): Observable<boolean> {
    return this._usersService.getUserInfo().pipe(
      tap((user) => {
        this._userManagerService.setUser(user);
        return true;
      }),
      map(() => true),
      catchError((error) => {
        this._authService.logout();
        this._router.navigate(['auth']);
        return of(false);
      })
    );
  }
}

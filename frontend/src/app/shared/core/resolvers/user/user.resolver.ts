import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { User } from 'src/app/shared/users/data-access/model/user';
import { UserManagerService } from '../../services/user-manager.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
  constructor(private _manager: UserManagerService) {}

  resolve(): User {
    return this._manager.user;
  }
}

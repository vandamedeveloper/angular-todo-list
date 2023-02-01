import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../../users/data-access/model/user';

@Injectable({
  providedIn: 'root',
})
export class UserManagerService {
  private _userSubject = new Subject<User>(); // create a subject to represent the user
  user: User; // user current information
  userChange: Observable<User>;

  constructor() {
    this.userChange = this._userSubject.asObservable(); // create an observable to represent the user
  }

  setUser(user) {
    this.user = user;
    this._userSubject.next(user);
  }
}

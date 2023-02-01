import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserManagerService } from 'src/app/shared/core/services/user-manager.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private basePath = 'http://localhost:3000/api';

  constructor(
    private _httpClient: HttpClient,
    private _userManager: UserManagerService
  ) {}

  getToken() {
    return localStorage.getItem('token') || null;
  }
  setToken(token?: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
    this._userManager.setUser(null);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  protected basePath = 'http://localhost:3000/api';

  constructor(private _httpClient: HttpClient) {}

  public getUserInfo(): Observable<User> {
    let headers = new HttpHeaders();
    headers = headers.set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this._httpClient.get<User>(`${this.basePath}/me`, { headers });
  }
  public signupUser(user: User): Observable<User> {
    return this._httpClient.post<User>(`${this.basePath}/signup`, user);
  }
  public loginUser(email: string, password: string): Observable<User> {
    const body = {
      email: email,
      password: password,
    };
    return this._httpClient.post<User>(`${this.basePath}/login`, body);
  }
  public register(
    username: string,
    email: string,
    password: string
  ): Observable<string> {
    const body = {
      username: username,
      email: email,
      password: password,
    };
    return this._httpClient.post<string>(`${this.basePath}/register`, body);
  }
}

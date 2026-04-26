import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {LoginResponseType} from '../../shared/types/login-response.type';
import {UserInfoType} from '../../shared/types/user-info.type';
import {BehaviorSubject, tap} from 'rxjs';
import {LogoutResponseType} from '../../shared/types/logout-response.type';
import {SignupResponseType} from '../../shared/types/signup-response.type';
import {RefreshResponseType} from '../../shared/types/refresh-response.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)

  accessTokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';
  private readonly userInfoKey = 'userInfo';

  isLogged$ = new BehaviorSubject<boolean>(!!localStorage.getItem(this.accessTokenKey));

  get loggedIn() {
    return this.isLogged$.getValue();
  }

  signUp(email: string, password: string, name: string, lastName: string) {
    return this.http.post<SignupResponseType>(`${environment.apiHost}signup`, {
      email,
      password,
      name,
      lastName,
    })
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponseType>(`${environment.apiHost}login`, {
      email,
      password,
    })
      .pipe(
        tap(result => {
          if (result.fullName && result.userId && result.accessToken && result.refreshToken) {
            this.setUserInfo({
              fullName: result.fullName,
              userId: result.userId,
              email,
            });
            this.setTokens(result.accessToken, result.refreshToken);
          }
        })
      )
  }

  refresh() {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    return this.http.post<RefreshResponseType>(`${environment.apiHost}refresh`, {refreshToken})
  }

  logout() {
    const refreshToken: string = localStorage.getItem(this.refreshTokenKey) || '';
    return this.http.post<LogoutResponseType>(`${environment.apiHost}logout`, {
      refreshToken
    })
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged$.next(true);
  }

  get getTokens() {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged$.next(false);
  }

  setUserInfo(info: UserInfoType): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(info));
  }

  getUserInfo(): UserInfoType | null {
    const userInfo: string = localStorage.getItem(this.userInfoKey) || '';
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  }

  removeUserInfo(): void {
    localStorage.removeItem(this.userInfoKey);
  }
}

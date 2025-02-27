import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  cookieService = inject(CookieService);
  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';

  accessToken: string | null = null;
  refreshToken: string | null = null;

  get isAuth() {
    if (!this.accessToken) {
      this.accessToken = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken');
    }

    return !!this.accessToken;
  }

  login(payload: { username: string; password: string }) {
    const formData = new FormData();

    formData.append('username', payload.username);
    formData.append('password', payload.password);

    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}token`, formData)
      .pipe(tap((value) => this.saveTokens(value)));
  }

  refreshAuthToken() {
    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}refresh`, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        tap((value) => this.saveTokens(value)),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  logout() {
    this.cookieService.delete('token');
    this.accessToken = null;
    this.refreshToken = null;
    this.router.navigate(['/login']);
  }

  saveTokens(res: TokenResponse) {
    this.accessToken = res.access_token;
    this.refreshToken = res.refresh_token;

    this.cookieService.set('token', this.accessToken);
    this.cookieService.set('refreshToken', this.refreshToken);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  cookieService = inject(CookieService);
  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';

  accessToken: string | null = null;
  refreshToken: string | null = null;

  get isAuth() {
    if (!this.accessToken) {
      this.accessToken = this.cookieService.get('token');
    }

    return !!this.accessToken;
  }

  login(payload: { username: string; password: string }) {
    const formData = new FormData();

    formData.append('username', payload.username);
    formData.append('password', payload.password);

    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}token`, formData)
      .pipe(
        tap((value) => {
          this.accessToken = value.access_token;
          this.refreshToken = value.refresh_token;

          this.cookieService.set('token', this.accessToken);
          this.cookieService.set('refreshToken', this.refreshToken);
        })
      );
  }

  constructor() {}
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  // шина для передачи нового токена ждущим запросам
  private readonly refreshSubject = new BehaviorSubject<string | null>(null);

  // флаг — идёт ли сейчас рефреш
  private isRefreshing = false;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokens = this.authService.getTokens;

    if (tokens.accessToken) {
      const authReq = this.addToken(req, tokens.accessToken);
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
            return this.handle401Error(authReq, next);
          }
          throw error;
        })
      );
    }

    return next.handle(req);
  }

  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({headers: req.headers.set('x-access-token', token)});
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) { // если рефреш ещё не запущен
      this.isRefreshing = true; // ставим флаг — теперь другие запросы будут ждать
      this.refreshSubject.next(null); // сбрасываем токен в шине — ждущие запросы не пройдут через filter
      return this.authService.refresh().pipe(
        switchMap(result => {
          // рефреш завершён, сбрасываем флаг
          this.isRefreshing = false;
          if (result && !result.error && result.accessToken && result.refreshToken) {
            this.authService.setTokens(result.accessToken, result.refreshToken);
            // кладём новый токен — ждущие запросы получат его и продолжат
            this.refreshSubject.next(result.accessToken)
            // повторяем исходный запрос с новым токеном
            return next.handle(this.addToken(req, result.accessToken));
          }
          throw new Error(result.message || 'Error occurred');
        }),
        catchError(error => {
          this.isRefreshing = false; // сбрасываем флаг даже при ошибке
          this.authService.removeTokens(); // удаляем токены — рефреш не помог
          this.authService.removeUserInfo();
          this.router.navigate(['/']);
          throw error;
        })
      )
    }

    // сюда попадают все запросы, которые пришли пока isRefreshing = true
    return this.refreshSubject.pipe(
      // ждём пока первый запрос положит новый токен (не null)
      filter(token => token !== null),
      // берём только одно значение и отписываемся
      take(1),
      // повторяем запрос с новым токеном
      switchMap(token => next.handle(this.addToken(req, token)))
  )
  }
}

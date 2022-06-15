import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError(err => {

        if ([401, 403].includes(err.status) && this.authService.userValue) {
          this.authService.logout()
        }

        const error = (err && err.error && err.error.message) || err.statusText
        console.error(err)
        return throwError(() => error)
      }))
  }
}

export const errorIntercept = { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

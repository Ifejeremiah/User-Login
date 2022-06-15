import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // add auth header with jwt if user is logged in and request is to the api url
    const user = this.authService.userValue
    const isLoggedIn = user && user.accessToken
    const isApiUrl = request.url.startsWith(environment.apiUri)

    if (isLoggedIn && isApiUrl) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${user.accessToken}` } })
    }

    return next.handle(request);
  }
}

export const jwtIntercept = {
  provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true
}

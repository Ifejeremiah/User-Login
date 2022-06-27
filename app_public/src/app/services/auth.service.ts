import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { environment } from '../../environments/environment'
import { Router } from '@angular/router';
import { LoginData } from '../models/login-data';
import { RegisterData } from '../models/register-data';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject!: BehaviorSubject<any>

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<any>(null);
  }

  private apiBase = environment.apiUri

  public get userValue(): User { return this.userSubject.value }

  login(body: LoginData): Observable<User> {
    return this.http.post<any>(`${this.apiBase}/auth/authenticate`, body, { withCredentials: true })
      .pipe(map(user => {
        this.userSubject.next(user.data)
        this.startRefreshTokenTimer()
        return user
      }))
  }

  register(body: RegisterData): Observable<User> {
    return this.http.post<any>(`${this.apiBase}/auth/register`, body, { withCredentials: true })
      .pipe(map(user => {
        this.userSubject.next(user.data)
        this.startRefreshTokenTimer()
        return user
      }))
  }

  googleAuth(body: { authToken: string, idToken: string }): Observable<User> {
    return this.http.post<any>(`${this.apiBase}/auth/google`, body, { withCredentials: true })
      .pipe(map(user => {
        this.userSubject.next(user.data)
        this.startRefreshTokenTimer()
        return user
      }))
  }

  logout(): void {
    this.http.post<any>(`${this.apiBase}/auth/logout`, {}, { withCredentials: true }).subscribe()
    this.stopRefreshTokenTimer()
    this.userSubject.next(null)
    this.router.navigate(['login'])
  }

  refreshToken(): Observable<User> {
    return this.http.post<any>(`${this.apiBase}/auth/refresh-token`, {}, { withCredentials: true })
      .pipe(map(user => {
        this.userSubject.next(user.data)
        this.startRefreshTokenTimer()
        return user
      }))
  }

  private refreshTokenTimeout: any

  private startRefreshTokenTimer(): void {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userValue.accessToken.split('.')[1]))

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000)
    const timeout = expires.getTime() - Date.now() - (60 * 1000)
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout)
  }


  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout)
  }
}

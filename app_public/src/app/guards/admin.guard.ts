import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private msgService: MessageService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.authService.userValue
    const isAdmin = user && user.role === 'Admin'

    if (isAdmin) {
      return true
    } else {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } })
      this.msgService.sendMsg('You can not access this resource')
      return false
    }
  }


}

import { APP_INITIALIZER } from "@angular/core";
import { AuthService } from "../services/auth.service";

export function appInitializer(authService: AuthService) {
  return () => new Promise<void>(resolve => authService.refreshToken().subscribe().add(resolve))
}

export const appInit = {
  provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService]
}
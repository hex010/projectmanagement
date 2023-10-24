import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService : AuthenticationService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const isAuthenticated = this.authService.isLoggedIn();
    const isLoginPage = state.url === '/login';

    if (isAuthenticated) {
        if (isLoginPage) {
            this.router.navigate(['']);
            return false;
        }
        return true;
    }

    if(!isLoginPage) {
        this.router.navigate(['/login']);
        return false;
    }
        
    return true;
  }
}
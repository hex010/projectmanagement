import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, Observable, catchError, throwError } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector, private router: Router) { }

  private handleHttpError(err: HttpErrorResponse) : Observable<any> {
    if (err.status === 401) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
       return EMPTY;
    }

    //kiti errorai bus sugauti subscriber'io, servisu, componentu
    return throwError(err);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authService = this.injector.get(AuthenticationService);

    const email = authService.getEmail();
    const password = authService.getPassword();
  
    if(email == null || password == null) return next.handle(req); //vartotojas neprisijunges, praleidziam request toliau

    //vartotojas prisijunges, nustatom header'ius
    let modifiedRequest = req.clone({
      setHeaders: {
        Email: email,
        Password: password
      }
    });
  
    return next.handle(modifiedRequest).pipe(catchError(err => this.handleHttpError(err)));
  }
  
  
}
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { LoginRequestInterface } from "../models/LoginRequest.interface";
import { AuthResponseInterface } from "../models/AuthResponse.interface";

@Injectable()
export class AuthenticationService {
    private loginUrl = "http://localhost:8080/ProjektuValdymoSistema/api/v1/login";

    constructor(private http: HttpClient, private router: Router) {}

    loginUser(userData: LoginRequestInterface) {
        return this.http.post<AuthResponseInterface>(this.loginUrl, userData);
    }

    isLoggedIn() {
        return !!localStorage.getItem('email') && !!localStorage.getItem('password'); // jeigu email ir password egzistuoja, grazins true, priesingai - false.
    }

    getEmail() {
        return localStorage.getItem('email')
    }

    getPassword() {
        return localStorage.getItem('password')
    }

    getRole() {
        return localStorage.getItem('role')
    }

    getFirstname() {
        return localStorage.getItem('firstname')
    }

    getLastname() {
        return localStorage.getItem('lastname')
    }

    logout() {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('role');
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        this.router.navigate(['/'])
    }
}
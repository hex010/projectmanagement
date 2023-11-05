import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { LoginRequestInterface } from '../models/LoginRequest.interface';
import { Router } from '@angular/router';
import { Role } from '../models/Role.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public submitted = false;
  public loginForm!: FormGroup;
  public loginError: string = "";
  
  constructor( 
    private formBuilder: FormBuilder,
    private _auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });
  }

  onSubmitLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const userData: LoginRequestInterface = {
      email: email,
      password: password
    };

    this._auth.loginUser(userData).subscribe({
      error: err => { 
        if(err.error.message)
          this.loginError = err.error.message;
      },
      next: response => {
        const userRole = response.role as unknown as keyof typeof Role;
        if (userRole in Role) {
          localStorage.setItem('role', Role[userRole]);
        } else {
          localStorage.setItem('role', Role.Team_member);
        }
        localStorage.setItem('email', response.email);
        localStorage.setItem('password', response.password);
        localStorage.setItem('firstname', response.firstname);
        localStorage.setItem('lastname', response.lastname);
        this.router.navigate(['/']);
      },
    });

  }

}

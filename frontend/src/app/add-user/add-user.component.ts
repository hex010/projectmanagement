import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Role } from '../models/Role.enum';
import { UserAddRequestInterface } from '../models/UserAddRequest.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  public submitted = false;
  public addUserForm!: FormGroup;
  public userAddError: string = "";
  public roles = Object.values(Role);

  constructor( 
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.addUserForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        role: [Role.Team_member, [Validators.required]]
    });
  }

  onSubmitLogin() {
    this.submitted = true;

    if (this.addUserForm.invalid) {
      return;
    }

    const email = this.addUserForm.value.email;
    const password = this.addUserForm.value.password;
    const firstname = this.addUserForm.value.firstname;
    const lastname = this.addUserForm.value.lastname;
    const role = this.userService.getRoleKeyByValue(this.addUserForm.value.role);

    const userData: UserAddRequestInterface = {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      role: role
    };

    this.userService.addUser(userData).subscribe({
      error: err => { 
        if(err.error.message)
          this.userAddError = err.error.message;
      },
      next: response => { 
        this._snackBar.open("Sėkmingai pridėta", '', {
          duration: 3000,
        });
        this.router.navigate(['/']);
      },
    });

  }

}

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditUserInterface } from '../models/EditUser.interface';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from '../models/Role.enum';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent {
  public userEditionForm!: FormGroup;
  public submitted = false;
  public serverError: string = "";
  public roles = Object.values(Role);

  constructor(@Inject(MAT_DIALOG_DATA) public userData : EditUserInterface, 
  private dialogRef : MatDialogRef<EditUserDialogComponent>,
  private formBuilder : FormBuilder,
  private userService : UserService,
  private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.convertToLithuaniaEnums();

    this.userEditionForm = this.formBuilder.group({
        email: [this.userData.email, [Validators.required, Validators.email]],
        firstname: [this.userData.firstname, Validators.required],
        lastname: [this.userData.lastname, Validators.required],
        banned: [this.userData.banned],
        role: [this.userData.role]
    });
  }

  private convertToLithuaniaEnums() {
    const convertedRole = this.userData.role as unknown as keyof typeof Role;
    this.userData.role = Role[convertedRole];
  }


  updateUser() {
    this.submitted = true;

    if (this.userEditionForm.invalid) {
      return;
    }

    const newUserData: EditUserInterface = {
      id: this.userData.id,
      email: this.userEditionForm.value.email,
      firstname: this.userEditionForm.value.firstname,
      lastname: this.userEditionForm.value.lastname,
      role: this.userEditionForm.value.role,
      banned: this.userEditionForm.value.banned,
    };
    

    this.userService.updateUser(newUserData).subscribe({
      error: err => { 
        if(err.error.message)
          this._snackBar.open(err.error.message, '', {
            duration: 3000,
          });
      },
      next: response => {
        if(response) {
          this._snackBar.open("Naudotojo duomenys atnaujinti sėkmingai.", '', {
            duration: 3000,
          });
          
          Object.assign(this.userData, response);

          this.dialogRef.close(true)
        } else {
          this._snackBar.open("Nepavyko atnaujinti duomenis duomenų bazėje.", '', {
            duration: 3000,
          });
          this.dialogRef.close(false)
        }
      },
    });
  }
}

import { Component } from '@angular/core';
import { EditUserInterface } from '../models/EditUser.interface';
import { DialogService } from '../services/dialog.service';
import { UserService } from '../services/user.service';
import { first } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  users:  EditUserInterface[] = [];
  displayedColumns: string[] = ['id', 'elPastas', 'vardas', 'pavarde', 'uzblokuotas', 'role', 'edit'];

  constructor(
    private dialogService: DialogService,
    private _snackBar: MatSnackBar,
    private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      }
    );
  }

  editUser(user : EditUserInterface) {
    this.dialogService.openEditUserDialog(user).afterClosed().pipe(first()).subscribe((succeed) => {
      if(!succeed) {
        this._snackBar.open("Užduoties pridėjimas atšauktas", '', {
          duration: 3000,
        });
      }
    });
  }
}

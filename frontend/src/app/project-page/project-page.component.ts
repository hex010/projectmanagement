import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectInterface } from '../models/Project.interface';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../models/Role.enum';
import { DialogService } from '../services/dialog.service';
import { first } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInterface } from '../models/User.interface';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent {
  public project!: ProjectInterface;

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private _auth: AuthenticationService, 
    private dialogService: DialogService, 
    private projectService: ProjectService,
    private _snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.project = data['project'];
    })
  }

  isTeamLeaderRole() : boolean {
    return this._auth.getRole() == Role[Role.Team_leader];
  }

  isTeamMemberRole() : boolean {
    return this._auth.getRole() == Role[Role.Team_member];
  }

  addTasksToTeamMember(userID : number) {
    const userFound = this.project.teamMembers.find(user => user.id === userID);

    if(!userFound) return;

    this.dialogService.openProjectTasksAdditionDialog(this.project.id, userFound).afterClosed().pipe(first()).subscribe((succeed) => {
      if(succeed) {
        this._snackBar.open("Užduotis sėkmingai pridėta komandos nariui", '', {
          duration: 3000,
        });
      } else {
        this._snackBar.open("Užduoties pridėjimas atšauktas", '', {
          duration: 3000,
        });
      }
    });
  }

  addTeamMembers() {
    this.dialogService.openProjectTeamMembersSelectionDialog(this.project.id).afterClosed().pipe(first()).subscribe(selectedUserId => {
      if(selectedUserId) {
        this.projectService.addUsersToProject(this.project.id, [selectedUserId]).subscribe({
          error: err => { 
            if(err.error.message)
              this._snackBar.open(err.error.message, '', {
                duration: 3000,
              });
          },
          next: response => { 
            this._snackBar.open("Sėkmingai pridėta", '', {
              duration: 3000,
            });
          },
        });
      }
    });
  }
}

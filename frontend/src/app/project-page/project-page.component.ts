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
import { TaskAdditionResponseInterface } from '../models/TaskAdditionResponse.interface';
import { TaskService } from '../services/task.service';
import { ProjectStatus } from '../models/ProjectStatus.enum';
import { ProjectFinishRequest } from '../models/ProjectFinishRequest.interface';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent {
  public project!: ProjectInterface;
  public assignedTasks: TaskAdditionResponseInterface[] = [];

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private _auth: AuthenticationService, 
    private dialogService: DialogService, 
    private projectService: ProjectService,
    private taskService: TaskService,
    private _snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.project = data['project'];
    })

    this.taskService.getAssignedProjects(this.project.id).subscribe(
      (data) => {
        this.assignedTasks = data;
      }
    );
  }

  isDirectorRole() : boolean {
    return this._auth.getRole() == Role.Director
  }

  isTeamLeaderRole() : boolean {
    return this._auth.getRole() == Role.Team_leader;
  }

  isTeamMemberRole() : boolean {
    return this._auth.getRole() == Role.Team_member
  }

  addTasksToTeamMember(userID : number) {
    const userFound = this.project.teamMembers.find(user => user.id === userID);

    if(!userFound) return;

    this.dialogService.openProjectTasksAdditionDialog(this.project.id, userFound).afterClosed().pipe(first()).subscribe((succeed) => {
      if(!succeed) {
        this._snackBar.open("Užduoties pridėjimas atšauktas", '', {
          duration: 3000,
        });
      }
    });
  }

  addTeamMembers() {
    this.dialogService.openProjectTeamMembersSelectionDialog(this.project.id).afterClosed().pipe(first()).subscribe(selectedTeamMembers => {
      if(selectedTeamMembers && selectedTeamMembers.length > 0) {
        this.projectService.addUsersToProject(this.project.id, selectedTeamMembers).subscribe({
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
      } else {
        this._snackBar.open("Komandos narių pridėjimas atšauktas", '', {
          duration: 3000,
        });
      }
    });
  }

  openTaskPage(taskID : number) {
    this.router.navigate(['task', taskID]);
  }

  finishProject() {
    this.dialogService.openProjectFinishDialog().afterClosed().pipe(first()).subscribe((projectFinishComment) => {
      if(!projectFinishComment) {
        this._snackBar.open("Projekto užbaigimas atšauktas", '', {
          duration: 3000,
        });
      } else {
        this.sendFinishProjectRequest(projectFinishComment);
      }
    });
  }

  private sendFinishProjectRequest(projectFinishComment : string) {
    const projectFinishRequest: ProjectFinishRequest = {
      projectId: this.project.id,
      projectFinishComment: projectFinishComment
    };

    this.projectService.finishProject(projectFinishRequest).subscribe({
      error: err => { 
        if(err.error.message)
          this._snackBar.open(err.error.message, '', {
            duration: 3000,
          });
      },
      next: response => {
        const projectStatusResponse = response as unknown as keyof typeof ProjectStatus;
        if(ProjectStatus[projectStatusResponse] === ProjectStatus.Finished) {
          this._snackBar.open("Projektas sėkmingai užbaigtas.", '', {
            duration: 3000,
          });
          this.router.navigate(['/']);
        } else {
          this._snackBar.open("Nenustatyta klaida. Projektas neužbaigtas.", '', {
            duration: 3000,
          });
        }
      },
    });
  }

}

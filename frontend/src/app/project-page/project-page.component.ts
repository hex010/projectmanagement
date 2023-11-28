import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectInterface } from '../models/Project.interface';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../models/Role.enum';
import { DialogService } from '../services/dialog.service';
import { first } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskAdditionResponseInterface } from '../models/TaskAdditionResponse.interface';
import { TaskService } from '../services/task.service';
import { ProjectStatus } from '../models/ProjectStatus.enum';
import { ProjectFinishRequest } from '../models/ProjectFinishRequest.interface';
import { ProjectTasksStatistics } from '../models/ProjectTasksStatistics.interface';
import { TaskStatus } from '../models/TaskStatus.enum';
import { UserInterface } from '../models/User.interface';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent {
  public project!: ProjectInterface;
  public assignedTasks: TaskAdditionResponseInterface[] = [];
  public projectTaskStatistics!: ProjectTasksStatistics;

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

    this.taskService.getAssignedTasks(this.project.id).subscribe(
      (data) => {
        this.assignedTasks = data;
      }
    );

    this.projectService.getProjectTasksStatistics(this.project.id).subscribe(
      (data) => {
        this.projectTaskStatistics = data;
      }
    );
  }

  isDirectorRole() : boolean {
    return this._auth.getRole() === Role.DIREKTORIUS.toString();
  }

  isTeamLeaderRole() : boolean {
    return this._auth.getRole() === Role.KOMANDOS_VADOVAS.toString();
  }

  isTeamMemberRole() : boolean {
    return this._auth.getRole() === Role.KOMANDOS_NARYS.toString();
  }

  public convertTaskStatusToLithuaniaEnum(task : TaskAdditionResponseInterface) {
    const convertedStatus = task.taskStatus as unknown as keyof typeof TaskStatus;
    return TaskStatus[convertedStatus];
  }

  addTasksToTeamMember(userID : number) {
    const userFound = this.project.teamMembers.find(user => user.id === userID);

    if(!userFound) return;

    this.dialogService.openProjectTasksAdditionDialog(this.project.id, userFound).afterClosed().pipe(first()).subscribe((newTask) => {
      if(!newTask) {
        this._snackBar.open("Užduoties pridėjimas atšauktas", '', {
          duration: 3000,
        });
      } else {
        this.assignedTasks.push(newTask);
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
            this.project.teamMembers.splice(0, this.project.teamMembers.length, ...response);
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

  isProjectFinished() : boolean{
    return this.project.projectStatus === this.projectService.getProjectStatusKeyByValue(ProjectStatus.Finished);
  }

  calculateIngoingProjectDate() : number {
    const startDateObj = new Date(this.project.startDate);
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - startDateObj.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }

  calculateFinishedProjectDate() {
    const endDateObj = new Date(this.project.finishDate);
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - endDateObj.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }

  calculateFinishedProjectDuration() {
    const startDateObj = new Date(this.project.startDate);
    const finishDateObj = new Date(this.project.finishDate);

    const timeDifference = finishDateObj.getTime() - startDateObj.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }

  calculateFinishedProjectLateDate() : string {
    const endDateObj = new Date(this.project.endDate); //kada turejo buti uzbaigtas
    const finishDateObj = new Date(this.project.finishDate); //kada realiai uzbaigtas buvo

    const timeDifference = finishDateObj.getTime() - endDateObj.getTime();

    const daysLate = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if(daysLate <= 0)
      return "nebuvo vėluotas";
    else
      return (daysLate + " dienas"); 
  }

  calculateFinishedProjectEarlierDate() : string {
    const endDateObj = new Date(this.project.endDate); //kada turejo buti uzbaigtas
    const finishDateObj = new Date(this.project.finishDate); //kada realiai uzbaigtas buvo

    const timeDifference = endDateObj.getTime() - finishDateObj.getTime();

    const daysLate = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if(daysLate <= 0)
      return "nebuvo baigtas anksčiau";
    else
      return (daysLate + " dienas"); 
  }

  getProjectTeamMembersCount() {
    return this.project.teamMembers.length;
  }

  getProjectTasksCount() {
    return this.projectTaskStatistics.allTasks;
  }

  getFinishedTasksCount() {
    return this.projectTaskStatistics.finishedTasks;
  }

  getActiveTasksCount() {
    return this.projectTaskStatistics.activeTasks;
  }

  getLateDoneTasksCount() {
    return this.projectTaskStatistics.lateTasks;
  }

  getEarlierDoneTasksCount() {
    return this.projectTaskStatistics.earlierDoneTasks;
  }

  getFinishedProjectComment() {
    return this.project.projectFinishComment;
  }

  openTaskStatistics(taskId : number) {
    this.dialogService.openProjectTaskStatistics(taskId)
    .afterClosed()
    .pipe(first())
    .subscribe();
  }
}

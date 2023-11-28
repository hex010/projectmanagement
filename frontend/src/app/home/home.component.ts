import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../models/Role.enum';
import { ProjectInterface } from '../models/Project.interface';
import { Observable } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { ProjectStatus } from '../models/ProjectStatus.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  assignedProjects: ProjectInterface[] = [];
  defaultFilterSelectedValue = "Vykdomi";

  constructor( 
    private router: Router,
    private _auth: AuthenticationService,
    private _projectService : ProjectService
  ) {}
  
  ngOnInit() {
    const filter = "Vykdomi";
    this._projectService.getAssignedProjects(filter).subscribe(
      (data) => {
        this.assignedProjects = data;
        this.convertToLithuaniaEnums();
      }
    );
  }

  private convertToLithuaniaEnums() {
    for (const project of this.assignedProjects) {
      const convertedStatus = project.projectStatus as unknown as keyof typeof ProjectStatus;
      project.projectStatus = ProjectStatus[convertedStatus];
    }
  }

  navigateToCreateProject() {
    this.router.navigate(['project', 'create']);
  }

  navigateToAddUser() {
    this.router.navigate(['adduser']);
  }

  navigateToEditUsers() {
    this.router.navigate(['editusers']);
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

  openProjectPage(projectID : number) {
    this.router.navigate(['project', projectID]);
  }

  filterProjects(event: any) {
    const selectedFilter = event.value;
    this._projectService.getAssignedProjects(selectedFilter).subscribe(
      (data) => {
        this.assignedProjects = data;
      }
    );
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../models/Role.enum';
import { ProjectInterface } from '../models/Project.interface';
import { Observable } from 'rxjs';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  assignedProjects: ProjectInterface[] = [];

  constructor( 
    private router: Router,
    private _auth: AuthenticationService,
    private _projectService : ProjectService
  ) {}
  
  ngOnInit() {
    this._projectService.getAssignedProjects().subscribe(
      (data) => {
        this.assignedProjects = data;
      }
    );
  }

  navigateToCreateProject() {
    this.router.navigate(['project', 'create']);
  }

  navigateToAddUser() {
    this.router.navigate(['adduser']);
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

  openProjectPage(projectID : number) {
    this.router.navigate(['project', projectID]);
  }
}

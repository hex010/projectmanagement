import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../models/Role.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor( 
    private router: Router,
    private _auth: AuthenticationService
  ) {}
  
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
}

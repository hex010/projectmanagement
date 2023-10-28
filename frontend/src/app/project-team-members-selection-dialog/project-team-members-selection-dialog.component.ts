import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { UserInterface } from '../models/User.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-team-members-selection-dialog',
  templateUrl: './project-team-members-selection-dialog.component.html',
  styleUrls: ['./project-team-members-selection-dialog.component.scss']
})
export class ProjectTeamMembersSelectionDialogComponent {
  teamMembersOrigin: UserInterface[] = [];
  teamMembersAvailable: UserInterface[] = [];
  userSelectionForm!: FormGroup;
  selectedTeamMembers: number[] = [];
  
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(@Inject(MAT_DIALOG_DATA) public projectID : number, 
                private dialogRef : MatDialogRef<ProjectTeamMembersSelectionDialogComponent>,
                private userService : UserService,
                private formBuilder : FormBuilder) {}
  
  ngOnInit() {
    this.userSelectionForm = this.formBuilder.group({
      user: ['']
    });

    this.userService.getAllTeamMembersForProjectID(this.projectID)
    .subscribe(
      (result) => {
        this.teamMembersOrigin = result;
        this.teamMembersAvailable = result;
      },
      (error) => {
        this.dialogRef.close(null);
      }
    );
    
  }

  addNewTeamMembersToTheProject() {
    if(this.selectedTeamMembers.length > 0)
      this.dialogRef.close(this.selectedTeamMembers)
    else
      this.dialogRef.close(-1)
  }

  addTeamMemberToList() {
    const selectedUserId : number = this.userSelectionForm.get('user')?.value;
    
    if(selectedUserId) {
      this.selectedTeamMembers.push(selectedUserId);
      this.removeTeamMemberById(selectedUserId);
    }

    this.userSelectionForm.get('user')?.reset();
  }

  private removeTeamMemberById(id: number) {
    this.teamMembersAvailable = this.teamMembersAvailable.filter(teamMember => teamMember.id !== id);
  }

  private findTeamMemberById(id: number): UserInterface | undefined {
    return this.teamMembersOrigin.find(teamMember => teamMember.id === id);
  }

  getUserFullNameById(teamMemberId : number) {
    const teamMember = this.findTeamMemberById(teamMemberId);
    
    if(teamMember) {
      return teamMember.firstname + " " + teamMember.lastname;
    } else {
      return "Įvyko klaida!"
    }
  }
}

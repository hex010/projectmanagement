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
  teamMembers: UserInterface[] = [];
  filteredTeamMembers: UserInterface[] = [];
  userSelectionForm!: FormGroup;
  
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
        this.teamMembers = result;
        this.filteredTeamMembers = result;
      },
      (error) => {
        this.dialogRef.close(null);
      }
    );
    
  }

  onUserSelectClose(){
    //this.searchInput.nativeElement.value = "";
    this.filteredTeamMembers = this.teamMembers.slice();
  }

  filterUsers() {

  }

  addNewTeamMembersToTheProject() {
    const selectedUserId : number = this.userSelectionForm.get('user')?.value;

    if(selectedUserId)
      this.dialogRef.close(selectedUserId)
    else
      this.dialogRef.close(-1)
  }
}

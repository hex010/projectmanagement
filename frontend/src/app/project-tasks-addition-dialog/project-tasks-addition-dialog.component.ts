import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectTeamMembersSelectionDialogComponent } from '../project-team-members-selection-dialog/project-team-members-selection-dialog.component';
import { UserInterface } from '../models/User.interface';
import { TaskPriority } from '../models/TaskPriority.enum';
import { TaskAdditionRequestInterface } from '../models/TaskAdditionRequest.interface';
import { TaskService } from '../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ProjectTeamMemberData {
  projectId: number;
  teamMember: UserInterface;
}

@Component({
  selector: 'app-project-tasks-addition-dialog',
  templateUrl: './project-tasks-addition-dialog.component.html',
  styleUrls: ['./project-tasks-addition-dialog.component.scss']
})
export class ProjectTasksAdditionDialogComponent {
  public taskAdditionForm!: FormGroup;
  public submitted = false;
  public taskPriorityValues = Object.values(TaskPriority);
  public serverError: string = "";
  public taskSelectedDocument!: File;

  constructor(@Inject(MAT_DIALOG_DATA) public projectUserData : ProjectTeamMemberData, 
  private dialogRef : MatDialogRef<ProjectTasksAdditionDialogComponent>,
  private formBuilder : FormBuilder,
  private taskService : TaskService,
  private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.taskAdditionForm = this.formBuilder.group({
        taskName: ['', Validators.required],
        taskDescription: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        taskPriority: [TaskPriority.Medium]
    });
  }

  onTaskDocumentSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if(inputElement.files)
      this.taskSelectedDocument = inputElement.files[0];
  }

  addNewTaskToTeamMember() {
    this.submitted = true;

    if (this.taskAdditionForm.invalid) {
      return;
    }

    const name = this.taskAdditionForm.value.taskName;
    const description = this.taskAdditionForm.value.taskDescription;
    const startDate = this.taskAdditionForm.value.startDate;
    const endDate = this.taskAdditionForm.value.endDate;
    const taskPriority = this.taskService.getTaskPriorityKeyByValue(this.taskAdditionForm.value.taskPriority);

    const ownerId = this.projectUserData.teamMember.id;
    const projectId = this.projectUserData.projectId;

    const taskData: TaskAdditionRequestInterface = {
      name: name,
      description: description,
      startDate: startDate,
      endDate: endDate,
      taskPriority: taskPriority,
      ownerId: ownerId,
      projectId: projectId
    };


    this.taskService.addTaskToTeamMember(taskData).subscribe({
      error: err => { 
        if(err.error.message)
          this.serverError = err.error.message;
      },
      next: response => { 
        if(this.taskSelectedDocument)
          this.uploadTaskDocument(response.id);
        else {
          this._snackBar.open("Užduotis sėkmingai pridėta komandos nariui", '', {
            duration: 3000,
          });
          this.dialogRef.close(true)
        }
      },
    });
  }

  uploadTaskDocument(taskId : number) {
    const formData = new FormData();
    formData.append('taskFile', this.taskSelectedDocument);

    this.taskService.uploadTaskDocument(taskId, formData).subscribe({
      error: err => { 
        this._snackBar.open("Užduotis sėkmingai pridėta komandos nariui, tačiau dokumentą įkelti nepavyko.", '', {
          duration: 3000,
        });
        this.dialogRef.close(true)
      },
      next: response => {
        this._snackBar.open("Užduotis sėkmingai pridėta komandos nariui", '', {
          duration: 3000,
        });
        this.dialogRef.close(true)
      },
    });
  }

}

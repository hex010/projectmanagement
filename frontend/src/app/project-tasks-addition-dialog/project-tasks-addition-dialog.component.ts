import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectTeamMembersSelectionDialogComponent } from '../project-team-members-selection-dialog/project-team-members-selection-dialog.component';
import { UserInterface } from '../models/User.interface';
import { TaskPriority } from '../models/TaskPriority.enum';
import { TaskAdditionRequestInterface } from '../models/TaskAdditionRequest.interface';
import { TaskService } from '../services/task.service';

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

  constructor(@Inject(MAT_DIALOG_DATA) public projectUserData : ProjectTeamMemberData, 
  private dialogRef : MatDialogRef<ProjectTeamMembersSelectionDialogComponent>,
  private formBuilder : FormBuilder,
  private taskService : TaskService) {}

  ngOnInit() {
    this.taskAdditionForm = this.formBuilder.group({
        taskName: ['', Validators.required],
        taskDescription: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        taskDocument: [''],
        taskPriority: ['Medium']
    });
  }

  addNewTaskToTeamMember() {
    this.submitted = true;

    if (this.taskAdditionForm.invalid) {
      return;
    }

    const name = this.taskAdditionForm.value.taskName;
    const description = this.taskAdditionForm.value.taskDescription;
    const filePath = this.taskAdditionForm.value.taskDocument;
    const startDate = this.taskAdditionForm.value.startDate;
    const endDate = this.taskAdditionForm.value.endDate;
    const taskPriority = this.taskAdditionForm.value.taskPriority;

    const ownerId = this.projectUserData.teamMember.id;
    const projectId = this.projectUserData.projectId;

    const taskData: TaskAdditionRequestInterface = {
      name: name,
      description: description,
      filePath: filePath,
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
        this.dialogRef.close(true)
      },
    });

  }

}

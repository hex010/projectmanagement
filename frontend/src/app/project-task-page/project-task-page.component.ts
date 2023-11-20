import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { TaskService } from '../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskAdditionResponseInterface } from '../models/TaskAdditionResponse.interface';
import { TaskStatus } from '../models/TaskStatus.enum';
import { TaskPriority } from '../models/TaskPriority.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateTaskStatusRequest } from '../models/UpdateTaskStatusRequest.interface';
import { DialogService } from '../services/dialog.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-project-task-page',
  templateUrl: './project-task-page.component.html',
  styleUrls: ['./project-task-page.component.scss']
})
export class ProjectTaskPageComponent {
  public task!: TaskAdditionResponseInterface;
  public taskForm!: FormGroup;
  public taskStatusValues = Object.values(TaskStatus);

  constructor(private route: ActivatedRoute, 
    private router: Router,
    private dialogService: DialogService,
    private formBuilder : FormBuilder,
    private _auth: AuthenticationService, 
    private taskService: TaskService,
    private _snackBar: MatSnackBar) {}
    
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.task = data['task'];
    })

    this.convertToLithuaniaEnums();

    this.taskForm = this.formBuilder.group({
      taskStatus: [this.task.taskStatus]
    });
  }

  private convertToLithuaniaEnums() {
    const convertedStatus = this.task.taskStatus as unknown as keyof typeof TaskStatus;
    const convertedPriority = this.task.taskPriority as unknown as keyof typeof TaskPriority;
    this.task.taskStatus = TaskStatus[convertedStatus];
    this.task.taskPriority = TaskPriority[convertedPriority];
  }

  updateTaskStatus() {
    if (this.taskForm.invalid) {
      return;
    }

    const taskStatus = this.taskService.getTaskStatusKeyByValue(this.taskForm.value.taskStatus);
    
    const taskStatusData: UpdateTaskStatusRequest = {
      taskId: this.task.id,
      taskStatus: taskStatus,
      taskFinishComment: ""
    };

    if(this.taskForm.value.taskStatus === TaskStatus.Completed) {
      this.dialogService.openTaskFinishDialog().afterClosed().pipe(first()).subscribe((taskFinishComment) => {
        if(!taskFinishComment) {
          this._snackBar.open("Užduoties užbaigimas atšauktas", '', {
            duration: 3000,
          });
        } else {
          taskStatusData.taskFinishComment = taskFinishComment;
          this.sendFinishTaskRequest(taskStatusData, taskStatus);
        }
      });
    } else {
      this.sendFinishTaskRequest(taskStatusData, taskStatus);
    }
  }


  sendFinishTaskRequest(taskStatusData: UpdateTaskStatusRequest, selectedTaskStatus : string) {
    this.taskService.updateTaskStatus(taskStatusData).subscribe({
      error: err => { 
        if(err.error.message)
          this._snackBar.open(err.error.message, '', {
            duration: 3000,
          });
      },
      next: response => {
        const taskStatusResponse = response as unknown as keyof typeof TaskStatus;
        
        if(taskStatusResponse === selectedTaskStatus) {
          this._snackBar.open("Užduoties statusas pakeistas sėkmingai.", '', {
            duration: 3000,
          });
          this.task.taskStatus = this.taskForm.value.taskStatus;
          this.taskForm.reset();
          this.taskForm = this.formBuilder.group({
            taskStatus: [this.task.taskStatus]
          });
          if(taskStatusResponse == this.taskService.getTaskStatusKeyByValue(TaskStatus.Completed)) {
            this.router.navigate(['project', this.task.projectId]);
          }
        } else {
          this._snackBar.open("Nenustatyta klaida. Užduoties statusas nepakeistas.", '', {
            duration: 3000,
          });
        }
      },
    });
  }
  
}

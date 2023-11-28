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
import { TaskCommentInterface } from '../models/TaskComment.interface';
import { SendTaskCommentRequestInterface } from '../models/SendTaskCommentRequest.interface';
import { Role } from '../models/Role.enum';

@Component({
  selector: 'app-project-task-page',
  templateUrl: './project-task-page.component.html',
  styleUrls: ['./project-task-page.component.scss']
})
export class ProjectTaskPageComponent {
  public task!: TaskAdditionResponseInterface;
  public taskForm!: FormGroup;
  public taskStatusValues = Object.values(TaskStatus);

  public taskCommentForm!: FormGroup;
  public submittedCommentForm = false;
  public taskComments: TaskCommentInterface[] = [];
  public newReply: string = ''; 

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

    this.taskCommentForm = this.formBuilder.group({
      taskCommentDescription: ['', Validators.required]
    });

    this.taskService.getTaskComments(this.task.id).subscribe(
      (data) => {
        this.taskComments = data;
      }
    );
  }

  isTeamLeaderRole() : boolean {
    return this._auth.getRole() === Role.KOMANDOS_VADOVAS.toString();
  }

  private convertToLithuaniaEnums() {
    const convertedStatus = this.task.taskStatus as unknown as keyof typeof TaskStatus;
    const convertedPriority = this.task.taskPriority as unknown as keyof typeof TaskPriority;
    this.task.taskStatus = TaskStatus[convertedStatus];
    this.task.taskPriority = TaskPriority[convertedPriority];
  }

  public updateTaskStatus() {
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


  private sendFinishTaskRequest(taskStatusData: UpdateTaskStatusRequest, selectedTaskStatus : string) {
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

  public sendTaskComment() {
    this.submittedCommentForm = true;

    if (this.taskCommentForm.invalid) {
      return;
    }

    const description = this.taskCommentForm.value.taskCommentDescription;

    const commentData: SendTaskCommentRequestInterface = {
      description: description,
      taskId: this.task.id,
      parentCommentId : -1
    };

    this.taskService.sendComment(commentData).subscribe({
      error: err => { 
        if(err.error.message)
          this._snackBar.open(err.error.message, '', {
            duration: 3000,
          });
      },
      next: response => {
        this.taskComments.push(response);
        this._snackBar.open("Komentaras sėkmingai pridėtas", '', {
          duration: 3000,
        });
        this.taskCommentForm.reset();
        this.submittedCommentForm = false;
      },
    });
  }
  
  public replyToComment(comment : TaskCommentInterface) {
    this.dialogService.openTaskCommentReplyDialog(comment).afterClosed().pipe(first()).subscribe((description) => {
      if(!description) {
        this._snackBar.open("Atsakymas į komentarą atšauktas", '', {
          duration: 3000,
        });
      } else {
        this.sendNewCommentReplyRequest(comment, description);
      }
    });
  }

  public getCommentsCount() : number {   
    return this.getCommentsCountRecursively(this.taskComments);
  }

  private getCommentsCountRecursively(comments: TaskCommentInterface[]) : number {
    let totalCount : number = 0

    comments.forEach(comment => {
      totalCount++;
      if (comment.replies && comment.replies.length > 0) {
        totalCount += this.getCommentsCountRecursively(comment.replies); // rekursyviai kitus atsakymus suskaiciuot
      }
    });

    return totalCount;
  }

  public sendNewCommentReplyRequest(comment : TaskCommentInterface, description: string) {
    const commentData: SendTaskCommentRequestInterface = {
      description: description,
      taskId: this.task.id,
      parentCommentId : comment.id
    };

    this.taskService.sendComment(commentData).subscribe({
      error: err => { 
        if(err.error.message)
          this._snackBar.open(err.error.message, '', {
            duration: 3000,
          });
      },
      next: response => {
        comment.replies.push(response);
        this._snackBar.open("Komentaras sėkmingai pridėtas", '', {
          duration: 3000,
        });
      },
    });
  }

  warnTeamMember() {
    this.taskService.sendWarningToTeamMember(this.task.id).subscribe({
      error: err => { 
        if(err.error.message)
          this._snackBar.open(err.error.message, '', {
            duration: 3000,
          });
      },
      next: response => {
        this._snackBar.open("Komandos narys sėkmingai įspėtas.", '', {
          duration: 3000,
        });
      },
    });
  }
}

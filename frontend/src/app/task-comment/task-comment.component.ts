import { Component, Input } from '@angular/core';
import { TaskCommentInterface } from '../models/TaskComment.interface';
import { DialogService } from '../services/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs';
import { SendTaskCommentRequestInterface } from '../models/SendTaskCommentRequest.interface';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent {
  @Input() comments: any[] = [];

  constructor(
    private taskService: TaskService,
    private dialogService: DialogService,
    private _snackBar: MatSnackBar) {}

  replyToComment(comment : TaskCommentInterface) {
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

  public sendNewCommentReplyRequest(comment : TaskCommentInterface, description: string) {
    const commentData: SendTaskCommentRequestInterface = {
      description: description,
      taskId: comment.taskId,
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
}
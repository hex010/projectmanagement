import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskCommentInterface } from '../models/TaskComment.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-comment-reply-dialog',
  templateUrl: './task-comment-reply-dialog.component.html',
  styleUrls: ['./task-comment-reply-dialog.component.scss']
})
export class TaskCommentReplyDialogComponent {
  public replyToCommentForm!: FormGroup;
  public submitted = false;

  constructor(@Inject(MAT_DIALOG_DATA) public comment : TaskCommentInterface, 
  private dialogRef : MatDialogRef<TaskCommentReplyDialogComponent>,
  private formBuilder : FormBuilder) {}
  
  ngOnInit() {
    this.replyToCommentForm = this.formBuilder.group({
      replyDescription: ['', Validators.required],
    });
  }

  replyToComment() {
    this.submitted = true;

    if (this.replyToCommentForm.invalid) {
      return;
    }

    const description = this.replyToCommentForm.value.replyDescription;
    this.dialogRef.close(description)
  }
}

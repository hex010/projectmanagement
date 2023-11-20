import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-finish-dialog',
  templateUrl: './task-finish-dialog.component.html',
  styleUrls: ['./task-finish-dialog.component.scss']
})
export class TaskFinishDialogComponent {
  public taskFinishForm!: FormGroup;
  public submitted = false;
  
  constructor(private dialogRef : MatDialogRef<TaskFinishDialogComponent>,
  private formBuilder : FormBuilder) {}

  ngOnInit() {
    this.taskFinishForm = this.formBuilder.group({
      taskFinishDescription: ['', Validators.required],
    });
  }

  finishTask() {
    this.submitted = true;

    if (this.taskFinishForm.invalid) {
      return;
    }

    const description = this.taskFinishForm.value.taskFinishDescription;
    this.dialogRef.close(description)
  }
}

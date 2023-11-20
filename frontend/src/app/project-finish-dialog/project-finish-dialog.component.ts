import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-finish-dialog',
  templateUrl: './project-finish-dialog.component.html',
  styleUrls: ['./project-finish-dialog.component.scss']
})
export class ProjectFinishDialogComponent {
  public projectFinishForm!: FormGroup;
  public submitted = false;
  
  constructor(private dialogRef : MatDialogRef<ProjectFinishDialogComponent>,
  private formBuilder : FormBuilder) {}

  ngOnInit() {
    this.projectFinishForm = this.formBuilder.group({
      projectFinishDescription: ['', Validators.required],
    });
  }

  finishProject() {
    this.submitted = true;

    if (this.projectFinishForm.invalid) {
      return;
    }

    const description = this.projectFinishForm.value.projectFinishDescription;
    this.dialogRef.close(description)
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { ProjectCreationRequestInterface } from '../models/ProjectCreationRequest.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  public submitted = false;
  public projectCreationForm!: FormGroup;
  public serverError: string = "";
  public projectSelectedDocument!: File;

  constructor( 
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.projectCreationForm = this.formBuilder.group({
        projectName: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        projectDescription: ['', Validators.required]
    });
  }

  onProjectDocumentSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if(inputElement.files)
      this.projectSelectedDocument = inputElement.files[0];
  }

  onSubmitProjectCreation() {
    this.submitted = true;

    if (this.projectCreationForm.invalid) {
      return;
    }

    const name = this.projectCreationForm.value.projectName;
    const description = this.projectCreationForm.value.projectDescription;
    const startDate = this.projectCreationForm.value.startDate;
    const endDate = this.projectCreationForm.value.endDate;

    const projectData: ProjectCreationRequestInterface = {
      name: name,
      description: description,
      startDate: startDate,
      endDate: endDate
    };

    this.projectService.createProject(projectData).subscribe({
      error: err => { 
        if(err.error.message)
          this.serverError = err.error.message;
      },
      next: response => {
        if(this.projectSelectedDocument)
          this.uploadProjectDocument(response.id);
        else {
          this._snackBar.open("Projektas sukurtas sėkmingai", '', {
            duration: 3000,
          });
          this.router.navigate(['/']);
        }
      },
    });
  }

  uploadProjectDocument(projectId : number) {
    const formData = new FormData();
    formData.append('projectFile', this.projectSelectedDocument);

    this.projectService.uploadProjectDocument(projectId, formData).subscribe({
      error: err => { 
        this._snackBar.open("Projektas sukurtas sėkmingai, tačiau dokumentą įkelti nepavyko.", '', {
          duration: 3000,
        });
        this.router.navigate(['/']);
      },
      next: response => {
        this._snackBar.open("Projektas sukurtas sėkmingai", '', {
          duration: 3000,
        });
        this.router.navigate(['/']);
      },
    });
  }
  
}

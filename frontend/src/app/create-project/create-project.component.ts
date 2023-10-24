import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { ProjectCreationRequestInterface } from '../models/ProjectCreationRequest.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  public submitted = false;
  public projectCreationForm!: FormGroup;
  public serverError: string = "";

  constructor( 
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.projectCreationForm = this.formBuilder.group({
        projectName: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        projectDescription: ['', Validators.required],
        projectDocuments: ['']
    });
  }


  onSubmitProjectCreation() {
    this.submitted = true;

    if (this.projectCreationForm.invalid) {
      return;
    }

    const name = this.projectCreationForm.value.projectName;
    const description = this.projectCreationForm.value.projectDescription;
    const filePath = this.projectCreationForm.value.projectDocuments;
    const startDate = this.projectCreationForm.value.startDate;
    const endDate = this.projectCreationForm.value.endDate;

    const projectData: ProjectCreationRequestInterface = {
      name: name,
      description: description,
      filePath: filePath,
      startDate: startDate,
      endDate: endDate
    };


    this.projectService.createProject(projectData).subscribe({
      error: err => { 
        if(err.error.message)
          this.serverError = err.error.message;
      },
      next: response => { 
        this.toastrService.success('Projektas sukurtas sėkmingai', 'Pavyko!');
        this.router.navigate(['/']);
      },
    });


  }
}

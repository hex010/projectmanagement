import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent {
  public errorMessage: string;

  constructor(private router: Router) {
    this.errorMessage = this.router.getCurrentNavigation()?.extras?.state?.['message'] || "Puslapis nerastas";
  }
}

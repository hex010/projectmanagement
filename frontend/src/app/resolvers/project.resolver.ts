import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { ProjectInterface } from "../models/Project.interface";
import { ProjectService } from "../services/project.service";
import { Injectable } from "@angular/core";
import { EMPTY, Observable, catchError, delay } from "rxjs";

@Injectable()
export class ProjectResolver implements Resolve<ProjectInterface> {
   constructor(private projectService : ProjectService, private router: Router) {}
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ProjectInterface | Observable<ProjectInterface> | Promise<ProjectInterface> {
       return this.projectService.getProject(route.params['id']).pipe(
        delay(1000),
        catchError(() => {
            const errorMessage = "Projektas nerastas";
            this.router.navigate(["/error", {state: {message : errorMessage}}]);
            return EMPTY;
        })
       )
   }
}
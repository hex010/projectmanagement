import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { TaskService } from "../services/task.service";
import { EMPTY, Observable, catchError, delay } from "rxjs";
import { Injectable } from "@angular/core";
import { TaskAdditionResponseInterface } from "../models/TaskAdditionResponse.interface";

@Injectable()
export class TaskResolver implements Resolve<TaskAdditionResponseInterface> {
   constructor(private taskService : TaskService, private router: Router) {}
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TaskAdditionResponseInterface | Observable<TaskAdditionResponseInterface> | Promise<TaskAdditionResponseInterface> {
       return this.taskService.getTask(route.params['id']).pipe(
        delay(1000),
        catchError(() => {
            const errorMessage = "Projekto užduotis nerasta";
            this.router.navigate(["/error", {state: {message : errorMessage}}]);
            return EMPTY;
        })
       )
   }
}
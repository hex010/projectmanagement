import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TaskAdditionRequestInterface } from "../models/TaskAdditionRequest.interface";
import { TaskAdditionResponseInterface } from "../models/TaskAdditionResponse.interface";
import { TaskPriority } from "../models/TaskPriority.enum";
import { Observable } from "rxjs";

@Injectable()
export class TaskService {
    private taskAdditionURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/task/add";
    private uploadTaskURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/task/uploadProjectDocument";
    private assignedTasksURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/task/get/assigned";

    constructor(private http: HttpClient) {}

    addTaskToTeamMember(taskData: TaskAdditionRequestInterface) {
        return this.http.post<TaskAdditionResponseInterface>(this.taskAdditionURL, taskData);
    }

    uploadTaskDocument(taskId: number, formData: FormData) {
        return this.http.post<any>(`${this.uploadTaskURL}/${taskId}`, formData);
    }

    getTaskPriorityKeyByValue(value: string) {
        const indexOfS = Object.values(TaskPriority).indexOf(value as TaskPriority);
      
        const key = Object.keys(TaskPriority)[indexOfS];
      
        return key;
    }
    
    getAssignedProjects(projectID : number): Observable<TaskAdditionResponseInterface[]> {
        return this.http.get<TaskAdditionResponseInterface[]>(`${this.assignedTasksURL}/${projectID}`);
    }
}
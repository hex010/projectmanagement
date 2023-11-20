import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TaskAdditionRequestInterface } from "../models/TaskAdditionRequest.interface";
import { TaskAdditionResponseInterface } from "../models/TaskAdditionResponse.interface";
import { TaskPriority } from "../models/TaskPriority.enum";
import { Observable } from "rxjs";
import { TaskStatus } from "../models/TaskStatus.enum";
import { UpdateTaskStatusRequest } from "../models/UpdateTaskStatusRequest.interface";

@Injectable()
export class TaskService {
    private taskAdditionURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/task/add";
    private uploadTaskURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/task/uploadProjectDocument";
    private assignedTasksURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/task/get/assigned";
    private getTaskURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/task/get";
    private updateTaskStatusURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/task/updateStatus";

    constructor(private http: HttpClient) {}

    addTaskToTeamMember(taskData: TaskAdditionRequestInterface) {
        return this.http.post<TaskAdditionResponseInterface>(this.taskAdditionURL, taskData);
    }

    uploadTaskDocument(taskId: number, formData: FormData) {
        return this.http.post<any>(`${this.uploadTaskURL}/${taskId}`, formData);
    }

    getTask(id: number) {
        return this.http.get<TaskAdditionResponseInterface>(`${this.getTaskURL}/${id}`);
    }

    getTaskPriorityKeyByValue(value: string) {
        const indexOfS = Object.values(TaskPriority).indexOf(value as TaskPriority);
      
        const key = Object.keys(TaskPriority)[indexOfS];
      
        return key;
    }

    getTaskStatusKeyByValue(value: string) {
        const indexOfS = Object.values(TaskStatus).indexOf(value as TaskStatus);
      
        const key = Object.keys(TaskStatus)[indexOfS];
      
        return key;
    }
    
    getAssignedProjects(projectID : number): Observable<TaskAdditionResponseInterface[]> {
        return this.http.get<TaskAdditionResponseInterface[]>(`${this.assignedTasksURL}/${projectID}`);
    }

    updateTaskStatus(taskStatusData: UpdateTaskStatusRequest) {
        return this.http.put<TaskStatus>(this.updateTaskStatusURL, taskStatusData);
    }
}
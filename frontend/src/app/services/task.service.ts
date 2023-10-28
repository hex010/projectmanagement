import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TaskAdditionRequestInterface } from "../models/TaskAdditionRequest.interface";
import { TaskAdditionResponseInterface } from "../models/TaskAdditionResponse.interface";

@Injectable()
export class TaskService {
    private taskAdditionURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/task/add";

    constructor(private http: HttpClient) {}

    addTaskToTeamMember(taskData: TaskAdditionRequestInterface) {
        return this.http.post<TaskAdditionResponseInterface>(this.taskAdditionURL, taskData);
    }
}
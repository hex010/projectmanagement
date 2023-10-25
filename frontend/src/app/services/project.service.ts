import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProjectCreationRequestInterface } from "../models/ProjectCreationRequest.interface";
import { ProjectCreationResponseInterface } from "../models/ProjectCreationRespons.interface";
import { ProjectInterface } from "../models/Project.interface";

@Injectable()
export class ProjectService {
    private projectCreationURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project/create";
    private getProjectURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project/get";
    private addTeamMembersToProject = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project";

    constructor(private http: HttpClient) {}

    createProject(projectDate: ProjectCreationRequestInterface) {
        return this.http.post<ProjectCreationResponseInterface>(this.projectCreationURL, projectDate);
    }

    getProject(id: number) {
        return this.http.get<ProjectInterface>(`${this.getProjectURL}/${id}`);
    }

    addUsersToProject(projectId: number, userIDs: number[]) {
        const url = `${this.addTeamMembersToProject}/${projectId}/addUsers`;
        return this.http.post(url, userIDs);
    }
}
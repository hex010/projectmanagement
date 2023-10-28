import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProjectCreationRequestInterface } from "../models/ProjectCreationRequest.interface";
import { ProjectCreationResponseInterface } from "../models/ProjectCreationRespons.interface";
import { ProjectInterface } from "../models/Project.interface";

@Injectable()
export class ProjectService {
    private projectCreationURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project/create";
    private getProjectURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project/get";
    private addTeamMembersToProjectURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project";
    private uploadProjectURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project/uploadProjectDocument";

    constructor(private http: HttpClient) {}

    createProject(projectData: ProjectCreationRequestInterface) {
        return this.http.post<ProjectCreationResponseInterface>(this.projectCreationURL, projectData);
    }

    uploadProjectDocument(projectId: number, formData: FormData) {
        return this.http.post<any>(`${this.uploadProjectURL}/${projectId}`, formData);
    }

    getProject(id: number) {
        return this.http.get<ProjectInterface>(`${this.getProjectURL}/${id}`);
    }

    addUsersToProject(projectId: number, userIDs: number[]) {
        const url = `${this.addTeamMembersToProjectURL}/${projectId}/addUsers`;
        return this.http.post(url, userIDs);
    }
}
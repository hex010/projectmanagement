import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProjectCreationRequestInterface } from "../models/ProjectCreationRequest.interface";
import { ProjectCreationResponseInterface } from "../models/ProjectCreationRespons.interface";
import { ProjectInterface } from "../models/Project.interface";
import { Observable } from "rxjs";
import { ProjectStatus } from "../models/ProjectStatus.enum";
import { ProjectFinishRequest } from "../models/ProjectFinishRequest.interface";

@Injectable()
export class ProjectService {
    private projectCreationURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project/create";
    private getProjectURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project/get";
    private getAssignedProjectsURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project/get/assigned"
    private addTeamMembersToProjectURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project";
    private uploadProjectURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project/uploadProjectDocument";
    private finishProjectURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project/finish";

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

    getAssignedProjects(filter : string): Observable<ProjectInterface[]> {
        let myparams = new HttpParams();
        myparams = myparams.set('filter', filter);

        return this.http.get<ProjectInterface[]>(this.getAssignedProjectsURL, {params: myparams});
    }

    finishProject(projectFinishRequest : ProjectFinishRequest) {
        return this.http.put<ProjectStatus>(this.finishProjectURL, projectFinishRequest);
    }
}
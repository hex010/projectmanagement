import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ProjectCreationRequestInterface } from "../models/ProjectCreationRequest.interface";
import { ProjectCreationResponseInterface } from "../models/ProjectCreationRespons.interface";

@Injectable()
export class ProjectService {
    private projectCreationURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/project/create";

    constructor(private http: HttpClient, private router: Router) {}

    createProject(projectDate: ProjectCreationRequestInterface) {
        return this.http.post<ProjectCreationResponseInterface>(this.projectCreationURL, projectDate);
    }
}
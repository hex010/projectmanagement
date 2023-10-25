import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserInterface } from "../models/User.interface";
import { UserAddResponseInterface } from "../models/UserAddResponse.interface";
import { UserAddRequestInterface } from "../models/UserAddRequest.interface";

@Injectable()
export class UserService {
    private getAllTeamMembersNotInProjectURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/user/getAllTeamMembersNotInProject";
    private userAddURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/user/add";

    constructor(private http: HttpClient) {}

    getAllTeamMembersForProjectID(projectID : number){
        const url = `${this.getAllTeamMembersNotInProjectURL}/${projectID}`;
        return this.http.get<UserInterface[]>(url);
    }
    
    addUser(userData: UserAddRequestInterface) {
        return this.http.post<UserAddResponseInterface>(this.userAddURL, userData);
    }
}
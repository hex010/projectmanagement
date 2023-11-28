import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserInterface } from "../models/User.interface";
import { UserAddResponseInterface } from "../models/UserAddResponse.interface";
import { UserAddRequestInterface } from "../models/UserAddRequest.interface";
import { EditUserInterface } from "../models/EditUser.interface";

@Injectable()
export class UserService {
    private getAllTeamMembersNotInProjectURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/user/getAllTeamMembersNotInProject";
    private userAddURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/user/add";
    private getAllUsersURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/user/getAll";
    private updateUserURL = "http://localhost:8080/ProjektuValdymoSistema/api/v1/user/update";

    constructor(private http: HttpClient) {}

    getAllTeamMembersForProjectID(projectID : number){
        const url = `${this.getAllTeamMembersNotInProjectURL}/${projectID}`;
        return this.http.get<UserInterface[]>(url);
    }
    
    addUser(userData: UserAddRequestInterface) {
        return this.http.post<UserAddResponseInterface>(this.userAddURL, userData);
    }

    getAllUsers(){
        return this.http.get<EditUserInterface[]>(this.getAllUsersURL);
    }

    updateUser(updateUser: EditUserInterface) {
        return this.http.put<EditUserInterface>(this.updateUserURL, updateUser);
    }
}
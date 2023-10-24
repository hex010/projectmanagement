import { Role } from "./Role.enum";

export interface AuthResponseInterface {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    role: Role;
}
import { Role } from "./Role.enum";

export interface EditUserInterface {
    id: number;
    email : string;
    firstname: string;
    lastname: string;
    banned: string;
    role: Role;
}
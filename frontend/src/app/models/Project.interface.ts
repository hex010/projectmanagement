import { UserInterface } from "./User.interface";

export interface ProjectInterface {
    id: number;
    name: string;
    description: string;
    filePath: string;
    startDate : string;
    endDate : string;
    teamMembers: UserInterface[];
}
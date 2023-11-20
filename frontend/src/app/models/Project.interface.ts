import { ProjectStatus } from "./ProjectStatus.enum";
import { UserInterface } from "./User.interface";

export interface ProjectInterface {
    id: number;
    name: string;
    description: string;
    filePath: string;
    startDate : string;
    endDate : string;
    projectStatus: ProjectStatus;
    teamMembers: UserInterface[];
}
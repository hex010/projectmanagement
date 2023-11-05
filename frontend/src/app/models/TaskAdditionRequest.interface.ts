import { TaskPriority } from "./TaskPriority.enum";

export interface TaskAdditionRequestInterface {
    name: string;
    description: string;
    startDate : string;
    endDate : string;
    taskPriority: string;
    ownerId : number;
    projectId : number;
}
import { TaskPriority } from "./TaskPriority.enum";

export interface TaskAdditionRequestInterface {
    name: string;
    description: string;
    startDate : string;
    endDate : string;
    taskPriority: TaskPriority
    ownerId : number;
    projectId : number;
}
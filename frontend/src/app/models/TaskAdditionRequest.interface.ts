import { TaskPriority } from "./TaskPriority.enum";

export interface TaskAdditionRequestInterface {
    name: string;
    description: string;
    filePath: string;
    startDate : string;
    endDate : string;
    taskPriority: TaskPriority
    ownerId : number;
    projectId : number;
}
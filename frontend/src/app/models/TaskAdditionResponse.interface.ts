import { TaskPriority } from "./TaskPriority.enum";

export interface TaskAdditionResponseInterface {
    id: number;
    name: string;
    description: string;
    filePath: string;
    startDate : string;
    endDate : string;
    taskPriority: TaskPriority
    ownerId : number;
    projectId : number;
}
import { TaskPriority } from "./TaskPriority.enum";
import { TaskStatus } from "./TaskStatus.enum";

export interface TaskAdditionResponseInterface {
    id: number;
    name: string;
    description: string;
    filePath: string;
    startDate : string;
    endDate : string;
    inProgressDate : string;
    finishDate : string;
    taskPriority : TaskPriority;
    taskStatus : TaskStatus;
    ownerId : number;
    projectId : number;
    warned : boolean;
    taskFinishComment : string;
}
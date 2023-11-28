import { TaskStatus } from "./TaskStatus.enum";

export interface TaskStatistics {
    startDate : string;
    endDate : string;
    
    inProgressDate : string;
    finishDate : string;

    notFinishedDays : number;
    finishedDays : number;
    finishedDuration : number;
    finishedLate : number;
    finishedEarlier : number;
    finishedComment : string;

    taskStatus : TaskStatus;
}
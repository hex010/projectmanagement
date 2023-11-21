export interface TaskCommentInterface {
    id: number;
    description: string;
    taskId : number;
    ownerFullName : string;
    replies : TaskCommentInterface[];
}
export interface UpdateTaskStatusRequest {
    taskId: number;
    taskStatus: string;
    taskFinishComment: string;
}
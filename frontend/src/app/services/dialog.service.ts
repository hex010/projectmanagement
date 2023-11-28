import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ProjectTeamMembersSelectionDialogComponent } from "../project-team-members-selection-dialog/project-team-members-selection-dialog.component";
import { UserInterface } from "../models/User.interface";
import { ProjectTasksAdditionDialogComponent } from "../project-tasks-addition-dialog/project-tasks-addition-dialog.component";
import { ProjectFinishDialogComponent } from "../project-finish-dialog/project-finish-dialog.component";
import { TaskFinishDialogComponent } from "../task-finish-dialog/task-finish-dialog.component";
import { TaskCommentReplyDialogComponent } from "../task-comment-reply-dialog/task-comment-reply-dialog.component";
import { TaskCommentInterface } from "../models/TaskComment.interface";
import { EditUserDialogComponent } from "../edit-user-dialog/edit-user-dialog.component";
import { EditUserInterface } from "../models/EditUser.interface";
import { ProjectTaskStatisticsDialogComponent } from "../project-task-statistics-dialog/project-task-statistics-dialog.component";

@Injectable()
export class DialogService {
    
    constructor(private dialog: MatDialog) {}
    
    openProjectTeamMembersSelectionDialog(projectId : number) : MatDialogRef<ProjectTeamMembersSelectionDialogComponent> {
        return this.dialog.open(ProjectTeamMembersSelectionDialogComponent, {
            width: '500px',
            data: projectId
        });
    }

    openProjectTasksAdditionDialog(projectId : number, teamMember : UserInterface) : MatDialogRef<ProjectTasksAdditionDialogComponent> {
        const dialogData = {
            projectId: projectId,
            teamMember: teamMember
        };

        return this.dialog.open(ProjectTasksAdditionDialogComponent, {
            width: '500px',
            data: dialogData
        });
    }

    openProjectFinishDialog() : MatDialogRef<ProjectFinishDialogComponent> {
        return this.dialog.open(ProjectFinishDialogComponent, {
            width: '500px'
        });
    }

    openTaskFinishDialog() : MatDialogRef<TaskFinishDialogComponent> {
        return this.dialog.open(TaskFinishDialogComponent, {
            width: '500px'
        });
    }

    openTaskCommentReplyDialog(comment : TaskCommentInterface) : MatDialogRef<TaskCommentReplyDialogComponent> {
        return this.dialog.open(TaskCommentReplyDialogComponent, {
            width: '500px',
            data: comment
        });
    }

    openEditUserDialog(user : EditUserInterface) : MatDialogRef<EditUserDialogComponent> {
        return this.dialog.open(EditUserDialogComponent, {
            width: '500px',
            data: user
        });
    }

    openProjectTaskStatistics(taskId : number): MatDialogRef<ProjectTaskStatisticsDialogComponent> {
        return this.dialog.open(ProjectTaskStatisticsDialogComponent, {
            width: '500px',
            data: taskId
        });
    }
}
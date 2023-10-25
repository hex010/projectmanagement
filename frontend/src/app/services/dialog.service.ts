import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ProjectTeamMembersSelectionDialogComponent } from "../project-team-members-selection-dialog/project-team-members-selection-dialog.component";

@Injectable()
export class DialogService {
    
    constructor(private dialog: MatDialog) {}
    
    openProjectTeamMembersSelectionDialog(projectId : number) : MatDialogRef<ProjectTeamMembersSelectionDialogComponent> {
        return this.dialog.open(ProjectTeamMembersSelectionDialogComponent, {
            width: '500px',
            data: projectId
        });
    }
}
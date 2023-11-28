package KompleksinisProjektas.ProjektuValdymoSistema.dtos;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.Task;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.TaskPriority;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskDTO {
    private int id;
    private String name;
    private String description;
    private String filePath;
    private TaskPriority taskPriority;
    private TaskStatus taskStatus;
    private boolean warned;
    private Date startDate;
    private Date endDate;

    private int ownerId;
    private int projectId;

    //statistikos
    private Date inProgressDate;
    private Date finishDate;
    private String taskFinishComment;

    public TaskDTO(Task task) {
        this.id = task.getId();
        this.name = task.getName();
        this.description = task.getDescription();
        this.filePath = task.getFilePath();
        this.taskPriority = task.getTaskPriority();
        this.taskStatus = task.getTaskStatus();
        this.startDate = task.getStartDate();
        this.endDate = task.getEndDate();
        this.ownerId = task.getTaskOwner().getId();
        this.projectId = task.getProject().getId();
        this.warned = task.isWarned();
        this.inProgressDate = task.getInProgressDate();
        this.finishDate = task.getFinishDate();
        this.taskFinishComment = task.getTaskFinishComment();
    }
}

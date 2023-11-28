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
    private Date startDate;
    private Date endDate;
    private TaskPriority taskPriority;
    private TaskStatus taskStatus;
    private boolean warned;

    private int ownerId;
    private int projectId;

    public TaskDTO(Task task) {
        this.id = task.getId();
        this.name = task.getName();
        this.description = task.getDescription();
        this.filePath = task.getFilePath();
        this.startDate = task.getStartDate();
        this.endDate = task.getEndDate();
        this.taskPriority = task.getTaskPriority();
        this.taskStatus = task.getTaskStatus();
        this.ownerId = task.getTaskOwner().getId();
        this.projectId = task.getProject().getId();
        this.warned = task.isWarned();
    }
}

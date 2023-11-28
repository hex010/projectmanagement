package KompleksinisProjektas.ProjektuValdymoSistema.Model;

import KompleksinisProjektas.ProjektuValdymoSistema.dtos.TaskFDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;
    private String description;
    private String filePath;
    private TaskPriority taskPriority;
    private TaskStatus taskStatus;
    private Date startDate;
    private Date endDate;
    private String taskFinishComment;
    private boolean warned;

    //statistikos
    private Date inProgressDate;
    private Date finishDate;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User taskOwner;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<TaskComment> commets;

    public Task(TaskFDTO taskFDTO, Project project, User foundUser) {
        this.name = taskFDTO.getName();
        this.description = taskFDTO.getDescription();
        this.taskPriority = taskFDTO.getTaskPriority();
        this.startDate = taskFDTO.getStartDate();
        this.endDate = taskFDTO.getEndDate();
        this.taskOwner = foundUser;
        this.project = project;
        this.taskStatus = TaskStatus.New;
    }
}

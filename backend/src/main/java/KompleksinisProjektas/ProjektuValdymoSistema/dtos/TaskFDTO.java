package KompleksinisProjektas.ProjektuValdymoSistema.dtos;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.TaskPriority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskFDTO {
    private String name;
    private String description;
    private TaskPriority taskPriority;
    private Date startDate;
    private Date endDate;

    private int ownerId;
    private int projectId;
}

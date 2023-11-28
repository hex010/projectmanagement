package KompleksinisProjektas.ProjektuValdymoSistema.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectTasksStatisticsDTO {
    int allTasks;
    int finishedTasks;
    int activeTasks;
    int lateTasks;
    int earlierDoneTasks;
}

package KompleksinisProjektas.ProjektuValdymoSistema.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskCommentDTO {
    int id;
    String description;
    int taskId;
    String ownerFullName;
    List<TaskCommentDTO> replies;
}

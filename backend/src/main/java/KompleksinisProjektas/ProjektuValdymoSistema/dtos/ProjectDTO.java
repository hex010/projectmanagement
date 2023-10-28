package KompleksinisProjektas.ProjektuValdymoSistema.dtos;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDTO {
    private int id;
    private String name;
    private String description;
    private String filePath;
    private Date startDate;
    private Date endDate;
    private List<UserDTO> teamMembers;
    private UserDTO teamLeader;

    public ProjectDTO(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.filePath = project.getFilePath();
        this.startDate = project.getStartDate();
        this.endDate = project.getEndDate();
        this.teamMembers = (project.getTeamMembers() != null && !project.getTeamMembers().isEmpty()) ?
                project.getTeamMembers().stream()
                        .map(user -> new UserDTO(user))
                        .collect(Collectors.toList()) :
                Collections.emptyList();
        this.teamLeader = new UserDTO(project.getTeamLeader());
    }
}

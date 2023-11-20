package KompleksinisProjektas.ProjektuValdymoSistema.Model;

import KompleksinisProjektas.ProjektuValdymoSistema.dtos.ProjectCreationFDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "project")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(length = 50)
    private String name;
    private String description;
    private String filePath;

    private Date startDate;
    private Date endDate;

    private ProjectStatus projectStatus;
    private String projectFinishComment;

    @ManyToOne
    @JoinColumn(name = "team_leader_id")
    private User teamLeader;

    @ManyToMany
    @JoinTable(name = "project_team_members",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> teamMembers;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Task> tasks;

    public Project(ProjectCreationFDTO projectCreationFDTO, User teamLeader) {
        this.name = projectCreationFDTO.getName();
        this.description = projectCreationFDTO.getDescription();
        this.startDate = projectCreationFDTO.getStartDate();
        this.endDate = projectCreationFDTO.getEndDate();
        this.teamLeader = teamLeader;
    }
}

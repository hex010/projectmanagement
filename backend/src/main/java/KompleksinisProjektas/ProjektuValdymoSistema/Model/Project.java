package KompleksinisProjektas.ProjektuValdymoSistema.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @GeneratedValue
    private Integer id;

    @Column(length = 50)
    private String name;
    private String description;
    private String filePath;

    private Date startDate;
    private Date endDate;

    @ManyToOne
    @JoinColumn(name = "team_leader_id")
    private User teamLeader;

    @ManyToMany
    @JoinTable(name = "project_team_members",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> teamMembers;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private Set<Task> tasks;
}

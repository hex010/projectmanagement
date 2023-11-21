package KompleksinisProjektas.ProjektuValdymoSistema.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "taskComment")
public class TaskComment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String description;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER) //orphanRemoval = true reiskia, jeigu trinsim parrent'a, issitrins ir vaikai
    private List<TaskComment> replies;
    @ManyToOne
    private TaskComment parentComment;
    @ManyToOne
    private Task task;
    @ManyToOne
    private User user;

    public TaskComment(String description, Task task, User user) {
        this.description = description;
        this.user = user;
        this.task = task;
    }
}

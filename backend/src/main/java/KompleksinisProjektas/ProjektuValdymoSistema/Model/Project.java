package KompleksinisProjektas.ProjektuValdymoSistema.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

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
}

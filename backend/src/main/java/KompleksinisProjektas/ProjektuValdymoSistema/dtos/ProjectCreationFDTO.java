package KompleksinisProjektas.ProjektuValdymoSistema.dtos;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectCreationFDTO {
    private String name;
    private String description;
    private String filePath;
    private Date startDate;
    private Date endDate;
}

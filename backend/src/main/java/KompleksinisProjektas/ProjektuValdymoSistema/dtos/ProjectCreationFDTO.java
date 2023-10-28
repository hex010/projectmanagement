package KompleksinisProjektas.ProjektuValdymoSistema.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectCreationFDTO {
    private String name;
    private String description;
    private Date startDate;
    private Date endDate;
}

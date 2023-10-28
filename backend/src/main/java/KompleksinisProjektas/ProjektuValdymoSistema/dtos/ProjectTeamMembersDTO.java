package KompleksinisProjektas.ProjektuValdymoSistema.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectTeamMembersDTO {
    private int id;
    private Set<UserDTO> teamMembers;
}

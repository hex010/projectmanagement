package KompleksinisProjektas.ProjektuValdymoSistema.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    int id;
    String firstname;
    String lastname;
}

package KompleksinisProjektas.ProjektuValdymoSistema.dtos;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {
    private String email;
    private Role role;
    private String password;
    private String firstname;
    private String lastname;
}

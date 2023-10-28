package KompleksinisProjektas.ProjektuValdymoSistema.Service;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UserDoesNotExistException;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.User;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.LoginRequestDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.LoginRequestFDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class AuthService {
    private final UserService userService;

    public LoginRequestDTO findUserAccount(LoginRequestFDTO loginRequest) {
        User user = userService.findUserByEmail(loginRequest.getEmail());

        if(!user.getPassword().equals(loginRequest.getPassword())) {
            throw new UserDoesNotExistException("Naudotojas nerastas");
        }

        return new LoginRequestDTO(user.getEmail(), user.getRole(), user.getPassword(), user.getFirstname(), user.getLastname());
    }
}

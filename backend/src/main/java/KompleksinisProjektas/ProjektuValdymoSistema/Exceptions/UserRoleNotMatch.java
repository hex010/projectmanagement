package KompleksinisProjektas.ProjektuValdymoSistema.Exceptions;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class UserRoleNotMatch extends RuntimeException {
    public UserRoleNotMatch(String message) {super(message);}
}
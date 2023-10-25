package KompleksinisProjektas.ProjektuValdymoSistema.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class UserAlreadyExistsInProjectException extends RuntimeException {
    public UserAlreadyExistsInProjectException(String message) {super(message);}
}

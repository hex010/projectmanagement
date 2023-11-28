package KompleksinisProjektas.ProjektuValdymoSistema.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.LOCKED)
public class UserIsLockedException extends RuntimeException {
    public UserIsLockedException(String message) {super(message);}
}
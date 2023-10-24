package KompleksinisProjektas.ProjektuValdymoSistema.Exceptions;

import org.springframework.security.core.AuthenticationException;

public class UserNotLoggedException extends AuthenticationException {
    public UserNotLoggedException(String message) {
        super(message);
    }
}
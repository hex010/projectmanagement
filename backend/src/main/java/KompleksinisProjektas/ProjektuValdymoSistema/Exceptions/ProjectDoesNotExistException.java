package KompleksinisProjektas.ProjektuValdymoSistema.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProjectDoesNotExistException extends RuntimeException {
    public ProjectDoesNotExistException(String message) {super(message);}
}

package KompleksinisProjektas.ProjektuValdymoSistema.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TaskDoesNotExistException extends RuntimeException {
    public TaskDoesNotExistException(String message) {super(message);}
}

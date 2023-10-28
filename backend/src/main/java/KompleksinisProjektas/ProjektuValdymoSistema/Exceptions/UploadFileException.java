package KompleksinisProjektas.ProjektuValdymoSistema.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UploadFileException extends RuntimeException {
    public UploadFileException(String message) {super(message);}
}

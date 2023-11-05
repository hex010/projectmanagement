package KompleksinisProjektas.ProjektuValdymoSistema.Configs;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ExceptionHandlerAdvice {

    @ExceptionHandler({UserDoesNotExistException.class, UserNotLoggedException.class, UnauthorizedTaskAdditionException.class})
    public ResponseEntity<Map<String, Object>> handleForbiddenExceptions(RuntimeException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({ProjectDoesNotExistException.class, TaskDoesNotExistException.class})
    public ResponseEntity<Map<String, Object>> handleNotFoundExceptions(RuntimeException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({UserAlreadyExistsInProjectException.class, UserRoleNotMatch.class, UserAlreadyExistsException.class})
    public ResponseEntity<Map<String, Object>> handleConflictExceptions(RuntimeException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler({StorageSaveException.class})
    public ResponseEntity<Map<String, Object>> handleInternalServerErrorExceptions(RuntimeException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler({UploadFileException.class})
    public ResponseEntity<Map<String, Object>> handleBadRequestExceptions(RuntimeException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
}

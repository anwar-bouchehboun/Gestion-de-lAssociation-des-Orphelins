package com.gestion.orphelins.exception;

import com.gestion.orphelins.utilitaire.ReponseMessage;
import com.gestion.orphelins.validation.NotFoundExceptionHndler;
import com.gestion.orphelins.validation.NoyFoundExceptionElement;
import com.gestion.orphelins.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import javax.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.security.access.AccessDeniedException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

        @ExceptionHandler(MethodArgumentNotValidException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ResponseEntity<Map<String, String>> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
                log.error("Erreur de validation des arguments: {}", ex.getMessage());
                Map<String, String> errors = new HashMap<>();
                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
                errors.put("message", "Erreur de validation des arguments");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(ValidationException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ResponseEntity<Map<String, String>> handleValidationException(ValidationException ex) {
                ReponseMessage.errors(
                                "Erreur de validation des arguments: " + ex.getMessage());
                Map<String, String> errors = new HashMap<>();
                errors.put("error", ex.getMessage());
                errors.put("message", ex.getMessage());
                return ResponseEntity.badRequest().body(errors);
        }

        @ExceptionHandler(NoyFoundExceptionElement.class)
        @ResponseStatus(HttpStatus.NOT_FOUND)
        public ResponseEntity<Map<String, String>> handleNotFoundException(NoyFoundExceptionElement ex,
                        String element) {
                log.error("Element  non trouvé: {}", ex.getMessage());
                ReponseMessage.errors(
                                "Element non trouvé: " + element);
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Element non trouvé: " + element);
                errorResponse.put("message", ex.getMessage());
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(NotFoundExceptionHndler.class)
        @ResponseStatus(HttpStatus.NOT_FOUND)
        public ResponseEntity<Map<String, String>> handleNotFoundException(NotFoundExceptionHndler ex) {
                log.error("Element  non trouvé: {}", ex.getMessage());
                ReponseMessage.errors(
                                "Element non trouvé: " + ex.getMessage());
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Element non trouvé: ");
                errorResponse.put("message", ex.getMessage());
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<Map<String, Object>> handleConstraintViolation(
                        ConstraintViolationException ex) {

                Map<String, Object> errors = new HashMap<>();
                errors.put("status", HttpStatus.BAD_REQUEST.value());
                errors.put("message", "Erreur de validation");

                Map<String, String> validationErrors = ex.getConstraintViolations()
                                .stream()
                                .collect(Collectors.toMap(
                                                violation -> violation.getPropertyPath().toString(),
                                                violation -> violation.getMessage(),
                                                (error1, error2) -> error1));

                errors.put("errors", validationErrors);

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(errors);
        }

        @ExceptionHandler(AccessDeniedException.class)
        @ResponseStatus(HttpStatus.FORBIDDEN)
        public ResponseEntity<Map<String, String>> handleAccessDeniedException(AccessDeniedException ex) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "Accès refusé : vous n'avez pas les autorisations nécessaires");
                return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        }

}

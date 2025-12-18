package server.api.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import server.infrustructure.error.AdviceErrorBody;

@RestControllerAdvice
public class AdviceController {

    private HttpStatus getStatus(HttpServletRequest request) {
        final Integer code = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        final HttpStatus status = (code != null) ? HttpStatus.resolve(code) : null;
        return (status != null) ? status : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<AdviceErrorBody> handleAnyException(HttpServletRequest request, Throwable ex) {
        final HttpStatus status = getStatus(request);
        return new ResponseEntity<>(new AdviceErrorBody(status.value(), ex.getMessage()), status);
    }
}

package server.infrustructure.error;

public class PasswordConfirmationException extends RuntimeException {
    public PasswordConfirmationException() {
        super("Password and password confirmation are not equals");
    }
}

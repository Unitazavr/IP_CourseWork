package server.infrustructure;
public class NotFoundException extends RuntimeException {
    public <T> NotFoundException(Class<T> entClass, Long id) {
        super(String.format("%s with id %s is not found", entClass.getSimpleName(), id));
    }
}

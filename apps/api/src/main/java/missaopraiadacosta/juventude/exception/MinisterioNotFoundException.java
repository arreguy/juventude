package missaopraiadacosta.juventude.exception;

public class MinisterioNotFoundException extends RuntimeException {
    public MinisterioNotFoundException(Integer id) {
        super("Ministério não encontrado com ID: " + id);
    }
    
    public MinisterioNotFoundException(String message) {
        super(message);
    }
}
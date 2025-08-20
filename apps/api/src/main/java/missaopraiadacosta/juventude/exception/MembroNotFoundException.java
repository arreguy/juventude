package missaopraiadacosta.juventude.exception;

public class MembroNotFoundException extends RuntimeException {
    public MembroNotFoundException(Integer id) {
        super("Membro não encontrado com ID: " + id);
    }
    
    public MembroNotFoundException(String message) {
        super(message);
    }
}
package missaopraiadacosta.juventude.exception;

public class EventoNotFoundException extends RuntimeException {
    public EventoNotFoundException(Integer id) {
        super("Evento não encontrado com ID: " + id);
    }
    
    public EventoNotFoundException(String message) {
        super(message);
    }
}
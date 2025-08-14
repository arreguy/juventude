package missaopraiadacosta.juventude.repository;

import missaopraiadacosta.juventude.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoRepository extends JpaRepository<Evento, Integer> {
}

package missaopraiadacosta.juventude.repository;

import missaopraiadacosta.juventude.enums.MinisterioNome;
import missaopraiadacosta.juventude.model.Ministerio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MinisterioRepository extends JpaRepository<Ministerio, Integer> {

    Optional<Ministerio> findByNome(MinisterioNome nome);
}

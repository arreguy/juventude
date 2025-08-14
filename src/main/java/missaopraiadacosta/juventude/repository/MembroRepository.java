package missaopraiadacosta.juventude.repository;

import missaopraiadacosta.juventude.model.Membro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MembroRepository extends JpaRepository<Membro, Integer> {

    List<Membro> findByAtivoTrue();
}

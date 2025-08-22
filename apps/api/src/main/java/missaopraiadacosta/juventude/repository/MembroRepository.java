package missaopraiadacosta.juventude.repository;

import missaopraiadacosta.juventude.model.Membro;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MembroRepository extends JpaRepository<Membro, Integer> {

    @EntityGraph("Membro.withMinisterios")
    List<Membro> findByAtivoTrue();
    
    @EntityGraph("Membro.withMinisterios")
    Optional<Membro> findById(Integer id);
    
    @EntityGraph("Membro.withMinisterios")
    List<Membro> findAll();
    
    @Query("SELECT m FROM Membro m LEFT JOIN FETCH m.ministerios WHERE m.id IN :ids")
    List<Membro> findByIdsWithMinisterios(@Param("ids") List<Integer> ids);
}

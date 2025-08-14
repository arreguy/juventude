package missaopraiadacosta.juventude.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Data
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private LocalDate data;

    private Integer contagemVisitantes;
    private Integer contagemHomens;
    private Integer contagemMulheres;
    private Integer contagemTotal;

    @ElementCollection
    @CollectionTable(name = "evento_ministerio",
            joinColumns = {@JoinColumn(name = "evento_id", referencedColumnName = "id")})
    @MapKeyJoinColumn(name = "ministerio_id")
    @Column(name = "quantidade")
    private Map<Ministerio, Integer> ministerios;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    private LocalDateTime criadoEm = LocalDateTime.now();
}

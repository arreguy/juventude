package missaopraiadacosta.juventude.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
@NamedEntityGraph(
    name = "Membro.withMinisterios",
    attributeNodes = @NamedAttributeNode("ministerios")
)
public class Membro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nome;

    private Integer idade;
    private LocalDate dataNascimento;
    private String telefone;
    private Boolean ativo;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "membro_ministerio",
            joinColumns = @JoinColumn(name = "membro_id"),
            inverseJoinColumns = @JoinColumn(name = "ministerio_id"))
    private Set<Ministerio> ministerios;
}

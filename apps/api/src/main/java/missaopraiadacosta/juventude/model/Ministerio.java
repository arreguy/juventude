package missaopraiadacosta.juventude.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import missaopraiadacosta.juventude.enums.MinisterioNome;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@ToString(exclude = "membros")
public class Ministerio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private MinisterioNome nome;

    @ManyToMany(mappedBy = "ministerios", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("ministerios")
    private Set<Membro> membros;

    public Ministerio() {
    }
}

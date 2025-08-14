package missaopraiadacosta.juventude.dto;

import lombok.Data;
import missaopraiadacosta.juventude.enums.MinisterioNome;
import java.util.Set;

@Data
public class MinisterioDto {
    private int id;
    private MinisterioNome nome;
    private Set<MembroMinisterioDto> membros;
}
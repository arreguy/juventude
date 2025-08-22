package missaopraiadacosta.juventude.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
public class MembroResponse {
    private Integer id;
    private String nome;
    private Integer idade;
    private LocalDate dataNascimento;
    private String telefone;
    private Boolean ativo;
    private Set<MinisterioResponse> ministerios;
}
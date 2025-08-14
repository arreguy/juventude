package missaopraiadacosta.juventude.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class MembroDto {

    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres")
    private String nome;

    private Integer idade;

    @Past(message = "Data de nascimento inválida")
    private LocalDate dataNascimento;

    @Size(max = 15, message = "Número de telefone muito longo")
    private String telefone;

    private Boolean ativo;
    private Set<Integer> ministerioIds;
}

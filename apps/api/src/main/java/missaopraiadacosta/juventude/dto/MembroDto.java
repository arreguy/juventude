package missaopraiadacosta.juventude.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class MembroDto {

    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres")
    private String nome;

    @Min(value = 0, message = "Idade deve ser maior que 0")
    @Max(value = 120, message = "Idade deve ser menor que 120")
    private Integer idade;

    @Past(message = "Data de nascimento inválida")
    private LocalDate dataNascimento;

    @Size(max = 15, message = "Número de telefone muito longo")
    @Pattern(regexp = "^[\\d\\s\\-\\(\\)\\+]*$", message = "Formato de telefone inválido")
    private String telefone;

    private Boolean ativo;
    
    @Size(max = 10, message = "Máximo de 10 ministérios por membro")
    private Set<@Positive(message = "ID do ministério deve ser positivo") Integer> ministerioIds;
}

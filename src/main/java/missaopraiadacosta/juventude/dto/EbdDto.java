package missaopraiadacosta.juventude.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EbdDto {
    @NotNull(message = "A data não pode ser nula.")
    private LocalDate data;

    @NotNull
    @Min(value = 0, message = "A contagem de homens não pode ser negativa.")
    private int contagemHomens;

    @NotNull
    @Min(value = 0, message = "A contagem de mulheres não pode ser negativa.")
    private int contagemMulheres;

    private String observacao;
}

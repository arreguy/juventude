package missaopraiadacosta.juventude.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CultoDto {
    @NotNull(message = "A data não pode ser nula.")
    private LocalDate data;

    @Min(value = 0, message = "O número de visitantes não pode ser negativo.")
    private int visitantes;

    @NotNull(message = "A contagem total é obrigatória.")
    @Min(value = 0, message = "A contagem total não pode ser negativa.")
    private int contagemTotal;

    @Min(value = 0, message = "O número de voluntários não pode ser negativo.")
    private int operacional;

    @Min(value = 0, message = "O número de voluntários não pode ser negativo.")
    private int recepcao;

    @Min(value = 0, message = "O número de voluntários não pode ser negativo.")
    private int producao;

    @Min(value = 0, message = "O número de voluntários não pode ser negativo.")
    private int louvor;

    @Min(value = 0, message = "O número de voluntários não pode ser negativo.")
    private int midia;

    @Min(value = 0, message = "O número de voluntários não pode ser negativo.")
    private int fotografia;

    @Min(value = 0, message = "O número de voluntários não pode ser negativo.")
    private int intercessao;

    private String observacao;
}

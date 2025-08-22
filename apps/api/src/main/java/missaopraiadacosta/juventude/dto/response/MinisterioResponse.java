package missaopraiadacosta.juventude.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MinisterioResponse {
    private Integer id;
    private String nome;
}
package missaopraiadacosta.juventude.mappers;

import missaopraiadacosta.juventude.dto.MembroMinisterioDto;
import missaopraiadacosta.juventude.dto.MinisterioDto;
import missaopraiadacosta.juventude.model.Ministerio;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class MinisterioMapper {

    public MinisterioDto toDto(Ministerio ministerio) {
        MinisterioDto dto = new MinisterioDto();
        dto.setId(ministerio.getId());
        dto.setNome(ministerio.getNome());

        if (ministerio.getMembros() != null) {
            dto.setMembros(ministerio.getMembros().stream().map(membro -> {
                MembroMinisterioDto membroDto = new MembroMinisterioDto();
                membroDto.setId(membro.getId());
                membroDto.setNome(membro.getNome());
                return membroDto;
            }).collect(Collectors.toSet()));
        }
        return dto;
    }
}

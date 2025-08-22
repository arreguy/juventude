package missaopraiadacosta.juventude.mappers;

import missaopraiadacosta.juventude.dto.MembroDto;
import missaopraiadacosta.juventude.dto.response.MembroResponse;
import missaopraiadacosta.juventude.dto.response.MinisterioResponse;
import missaopraiadacosta.juventude.model.Membro;
import missaopraiadacosta.juventude.model.Ministerio;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class MembroMapper {

    public void toEntity(MembroDto dto, Membro membro, Set<Ministerio> ministerios) {
        membro.setNome(dto.getNome());
        membro.setDataNascimento(dto.getDataNascimento());
        membro.setTelefone(dto.getTelefone());
        membro.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);

        if (dto.getDataNascimento() != null) {
            membro.setIdade(Period.between(dto.getDataNascimento(), LocalDate.now()).getYears());
        } else {
            membro.setIdade(dto.getIdade());
        }

        if (ministerios != null && !ministerios.isEmpty()) {
            membro.setMinisterios(ministerios);
        }
    }

    public MembroResponse toResponse(Membro membro) {
        if (membro == null) {
            return null;
        }
        
        Set<MinisterioResponse> ministerioResponses = null;
        if (membro.getMinisterios() != null) {
            ministerioResponses = membro.getMinisterios().stream()
                .map(this::toMinisterioResponse)
                .collect(Collectors.toSet());
        }
        
        return MembroResponse.builder()
            .id(membro.getId())
            .nome(membro.getNome())
            .idade(membro.getIdade())
            .dataNascimento(membro.getDataNascimento())
            .telefone(membro.getTelefone())
            .ativo(membro.getAtivo())
            .ministerios(ministerioResponses)
            .build();
    }
    
    private MinisterioResponse toMinisterioResponse(Ministerio ministerio) {
        return MinisterioResponse.builder()
            .id(ministerio.getId())
            .nome(ministerio.getNome().name())
            .build();
    }
}

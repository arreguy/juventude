package missaopraiadacosta.juventude.mappers;

import missaopraiadacosta.juventude.dto.MembroDto;
import missaopraiadacosta.juventude.model.Membro;
import missaopraiadacosta.juventude.model.Ministerio;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;
import java.util.Set;

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
}

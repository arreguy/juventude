package missaopraiadacosta.juventude.service;

import missaopraiadacosta.juventude.dto.EbdDto;
import missaopraiadacosta.juventude.model.Evento;
import missaopraiadacosta.juventude.repository.EventoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EbdService {

    private final EventoRepository eventoRepository;

    public EbdService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    @Transactional
    public Evento registrarEbd(EbdDto ebdDto) {
        Evento evento = new Evento();
        evento.setCategoria("EBD");
        evento.setData(ebdDto.getData());
        evento.setObservacao(ebdDto.getObservacao());
        evento.setContagemHomens(ebdDto.getContagemHomens());
        evento.setContagemMulheres(ebdDto.getContagemMulheres());

        evento.setContagemTotal(ebdDto.getContagemHomens() + ebdDto.getContagemMulheres());

        return eventoRepository.save(evento);
    }
}

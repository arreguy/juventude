package missaopraiadacosta.juventude.service;

import missaopraiadacosta.juventude.dto.CultoDto;
import missaopraiadacosta.juventude.enums.MinisterioNome;
import missaopraiadacosta.juventude.model.Evento;
import missaopraiadacosta.juventude.model.Ministerio;
import missaopraiadacosta.juventude.repository.EventoRepository;
import missaopraiadacosta.juventude.repository.MinisterioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class CultoService {

    private final EventoRepository eventoRepository;
    private final MinisterioRepository ministerioRepository;

    public CultoService(EventoRepository eventoRepository, MinisterioRepository ministerioRepository) {
        this.eventoRepository = eventoRepository;
        this.ministerioRepository = ministerioRepository;
    }

    @Transactional
    public Evento registrarCulto(CultoDto cultoDto) {
        Evento evento = new Evento();
        evento.setCategoria("Culto");
        evento.setData(cultoDto.getData());
        evento.setObservacao(cultoDto.getObservacao());
        evento.setContagemVisitantes(cultoDto.getVisitantes());
        evento.setContagemTotal(cultoDto.getContagemTotal());

        Map<String, MinisterioNome> fieldToEnum = new HashMap<>();
        fieldToEnum.put("operacional", MinisterioNome.OPERACIONAL);
        fieldToEnum.put("recepcao", MinisterioNome.RECEPCAO);
        fieldToEnum.put("producao", MinisterioNome.PRODUCAO);
        fieldToEnum.put("louvor", MinisterioNome.LOUVOR);
        fieldToEnum.put("midia", MinisterioNome.CRIATIVO);
        fieldToEnum.put("fotografia", MinisterioNome.FOTOGRAFIA);
        fieldToEnum.put("intercessao", MinisterioNome.INTERCESSAO);

        Map<Ministerio, Integer> quantidadesMinisterios = new HashMap<>();

        try {
            for (var entry : fieldToEnum.entrySet()) {
                var field = cultoDto.getClass().getDeclaredField(entry.getKey());
                field.setAccessible(true);
                int quantidade = (int) field.get(cultoDto);
                if (quantidade > 0) {
                    Ministerio ministerio = ministerioRepository.findByNome(entry.getValue())
                            .orElseThrow(() -> new RuntimeException("Ministério não encontrado: " + entry.getValue()));
                    quantidadesMinisterios.put(ministerio, quantidade);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar ministérios do culto: " + e.getMessage(), e);
        }

        evento.setMinisterios(quantidadesMinisterios);

        return eventoRepository.save(evento);
    }
}

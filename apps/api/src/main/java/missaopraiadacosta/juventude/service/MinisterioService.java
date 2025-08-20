package missaopraiadacosta.juventude.service;

import missaopraiadacosta.juventude.dto.MinisterioDto;
import missaopraiadacosta.juventude.exception.MinisterioNotFoundException;
import missaopraiadacosta.juventude.mappers.MinisterioMapper;
import missaopraiadacosta.juventude.model.Ministerio;
import missaopraiadacosta.juventude.repository.MinisterioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MinisterioService {

    private final MinisterioRepository ministerioRepository;
    private final MinisterioMapper ministerioMapper;

    public MinisterioService(MinisterioRepository ministerioRepository, MinisterioMapper ministerioMapper) {
        this.ministerioRepository = ministerioRepository;
        this.ministerioMapper = ministerioMapper;
    }

    @Transactional(readOnly = true)
    public List<MinisterioDto> listarTodos() {
        return ministerioRepository.findAll().stream()
                .map(ministerioMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Ministerio buscarPorId(Integer id) {
        return ministerioRepository.findById(id)
                .orElseThrow(() -> new MinisterioNotFoundException(id));
    }
}

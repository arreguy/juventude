package missaopraiadacosta.juventude.service;

import jakarta.transaction.Transactional;
import missaopraiadacosta.juventude.dto.MembroDto;
import missaopraiadacosta.juventude.exception.MembroNotFoundException;
import missaopraiadacosta.juventude.exception.MinisterioNotFoundException;
import missaopraiadacosta.juventude.mappers.MembroMapper;
import missaopraiadacosta.juventude.model.Membro;
import missaopraiadacosta.juventude.model.Ministerio;
import missaopraiadacosta.juventude.repository.MembroRepository;
import missaopraiadacosta.juventude.repository.MinisterioRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class MembroService {

    private final MembroRepository membroRepository;
    private final MinisterioRepository ministerioRepository;
    private final MembroMapper membroMapper;

    public MembroService(MembroRepository membroRepository, MinisterioRepository ministerioRepository, MembroMapper membroMapper) {
        this.membroRepository = membroRepository;
        this.ministerioRepository = ministerioRepository;
        this.membroMapper = membroMapper;
    }

    @Transactional
    public Membro criarMembro(MembroDto membroDto) {
        Membro membro = new Membro();
        Set<Ministerio> ministerios = getMinisteriosFromIds(membroDto.getMinisterioIds());
        membroMapper.toEntity(membroDto, membro, ministerios);
        return membroRepository.save(membro);
    }

    @Transactional
    public Membro atualizarMembro(Integer id, MembroDto membroDto) {
        Membro membro = membroRepository.findById(id)
                .orElseThrow(() -> new MembroNotFoundException(id));
        Set<Ministerio> ministerios = getMinisteriosFromIds(membroDto.getMinisterioIds());
        membroMapper.toEntity(membroDto, membro, ministerios);
        return membroRepository.save(membro);
    }

    private Set<Ministerio> getMinisteriosFromIds(Set<Integer> ministerioIds) {
        if (ministerioIds == null || ministerioIds.isEmpty()) return null;
        Set<Ministerio> ministerios = new HashSet<>();
        for (Integer ministerioId : ministerioIds) {
            Ministerio ministerio = ministerioRepository.findById(ministerioId)
                    .orElseThrow(() -> new MinisterioNotFoundException(ministerioId));
            ministerios.add(ministerio);
        }
        return ministerios;
    }

    public Membro buscarPorId(Integer id) {
        return membroRepository.findById(id)
                .orElseThrow(() -> new MembroNotFoundException(id));
    }

    public List<Membro> listarTodos() {
        return membroRepository.findAll();
    }

    public List<Membro> listarAtivos() {
        return membroRepository.findByAtivoTrue();
    }

    @Transactional
    public void deletarMembro(Integer id) {
        if (!membroRepository.existsById(id)) {
            throw new MembroNotFoundException(id);
        }
        membroRepository.deleteById(id);
    }

    @Transactional
    public void inativarMembro(Integer id) {
        Membro membro = membroRepository.findById(id)
                .orElseThrow(() -> new MembroNotFoundException(id));

        membro.setAtivo(false);
        membroRepository.save(membro);
    }
}

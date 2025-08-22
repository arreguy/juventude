package missaopraiadacosta.juventude.service;

import jakarta.transaction.Transactional;
import missaopraiadacosta.juventude.dto.MembroDto;
import missaopraiadacosta.juventude.dto.response.MembroResponse;
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
import java.util.stream.Collectors;

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
    public MembroResponse criarMembro(MembroDto membroDto) {
        Membro membro = new Membro();
        Set<Ministerio> ministerios = getMinisteriosFromIds(membroDto.getMinisterioIds());
        membroMapper.toEntity(membroDto, membro, ministerios);
        Membro savedMembro = membroRepository.save(membro);
        return membroMapper.toResponse(savedMembro);
    }

    @Transactional
    public MembroResponse atualizarMembro(Integer id, MembroDto membroDto) {
        Membro membro = membroRepository.findById(id)
                .orElseThrow(() -> new MembroNotFoundException(id));
        Set<Ministerio> ministerios = getMinisteriosFromIds(membroDto.getMinisterioIds());
        membroMapper.toEntity(membroDto, membro, ministerios);
        Membro savedMembro = membroRepository.save(membro);
        return membroMapper.toResponse(savedMembro);
    }

    private Set<Ministerio> getMinisteriosFromIds(Set<Integer> ministerioIds) {
        if (ministerioIds == null || ministerioIds.isEmpty()) return null;
        
        // Batch fetch all ministries to avoid N+1 queries
        List<Ministerio> foundMinisterios = ministerioRepository.findAllById(ministerioIds);
        
        // Validate all IDs were found
        if (foundMinisterios.size() != ministerioIds.size()) {
            Set<Integer> foundIds = foundMinisterios.stream()
                .map(Ministerio::getId)
                .collect(Collectors.toSet());
            Set<Integer> missingIds = ministerioIds.stream()
                .filter(id -> !foundIds.contains(id))
                .collect(Collectors.toSet());
            throw new MinisterioNotFoundException(missingIds.iterator().next());
        }
        
        return new HashSet<>(foundMinisterios);
    }

    public MembroResponse buscarPorId(Integer id) {
        Membro membro = membroRepository.findById(id)
                .orElseThrow(() -> new MembroNotFoundException(id));
        return membroMapper.toResponse(membro);
    }

    public List<MembroResponse> listarTodos() {
        List<Membro> membros = membroRepository.findAll();
        return membros.stream()
            .map(membroMapper::toResponse)
            .collect(Collectors.toList());
    }

    public List<MembroResponse> listarAtivos() {
        List<Membro> membros = membroRepository.findByAtivoTrue();
        return membros.stream()
            .map(membroMapper::toResponse)
            .collect(Collectors.toList());
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

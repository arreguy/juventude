package missaopraiadacosta.juventude.service;

import missaopraiadacosta.juventude.dto.MembroDto;
import missaopraiadacosta.juventude.dto.response.MembroResponse;
import missaopraiadacosta.juventude.exception.MembroNotFoundException;
import missaopraiadacosta.juventude.mappers.MembroMapper;
import missaopraiadacosta.juventude.model.Membro;
import missaopraiadacosta.juventude.repository.MembroRepository;
import missaopraiadacosta.juventude.repository.MinisterioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MembroServiceUnitTest {

    @Mock
    private MembroRepository membroRepository;
    
    @Mock
    private MinisterioRepository ministerioRepository;
    
    @Mock
    private MembroMapper membroMapper;
    
    @InjectMocks
    private MembroService membroService;
    
    private MembroDto membroDto;
    private Membro membro;
    private MembroResponse membroResponse;

    @BeforeEach
    void setUp() {
        membroDto = new MembroDto();
        membroDto.setNome("João Silva");
        membroDto.setIdade(25);
        membroDto.setDataNascimento(LocalDate.of(1998, 5, 15));
        membroDto.setTelefone("11999999999");
        membroDto.setAtivo(true);
        membroDto.setMinisterioIds(Set.of());

        membro = new Membro();
        membro.setId(1);
        membro.setNome("João Silva");
        membro.setIdade(25);
        membro.setDataNascimento(LocalDate.of(1998, 5, 15));
        membro.setTelefone("11999999999");
        membro.setAtivo(true);

        membroResponse = MembroResponse.builder()
            .id(1)
            .nome("João Silva")
            .idade(25)
            .dataNascimento(LocalDate.of(1998, 5, 15))
            .telefone("11999999999")
            .ativo(true)
            .ministerios(Set.of())
            .build();
    }

    @Test
    void criarMembro_DeveRetornarMembroResponse() {
        // Given
        when(membroRepository.save(any(Membro.class))).thenReturn(membro);
        when(membroMapper.toResponse(membro)).thenReturn(membroResponse);

        // When
        MembroResponse result = membroService.criarMembro(membroDto);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getNome()).isEqualTo("João Silva");
        assertThat(result.getIdade()).isEqualTo(25);
        verify(membroRepository).save(any(Membro.class));
        verify(membroMapper).toEntity(eq(membroDto), any(Membro.class), eq(null));
        verify(membroMapper).toResponse(membro);
    }

    @Test
    void buscarPorId_QuandoMembroExiste_DeveRetornarMembroResponse() {
        // Given
        when(membroRepository.findById(1)).thenReturn(Optional.of(membro));
        when(membroMapper.toResponse(membro)).thenReturn(membroResponse);

        // When
        MembroResponse result = membroService.buscarPorId(1);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1);
        assertThat(result.getNome()).isEqualTo("João Silva");
    }

    @Test
    void buscarPorId_QuandoMembroNaoExiste_DeveLancarExcecao() {
        // Given
        when(membroRepository.findById(999)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> membroService.buscarPorId(999))
            .isInstanceOf(MembroNotFoundException.class);
    }

    @Test
    void deletarMembro_QuandoMembroExiste_DeveExcluir() {
        // Given
        when(membroRepository.existsById(1)).thenReturn(true);

        // When
        membroService.deletarMembro(1);

        // Then
        verify(membroRepository).deleteById(1);
    }

    @Test
    void deletarMembro_QuandoMembroNaoExiste_DeveLancarExcecao() {
        // Given
        when(membroRepository.existsById(999)).thenReturn(false);

        // When/Then
        assertThatThrownBy(() -> membroService.deletarMembro(999))
            .isInstanceOf(MembroNotFoundException.class);
    }
}
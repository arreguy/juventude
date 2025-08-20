package missaopraiadacosta.juventude.controller;

import missaopraiadacosta.juventude.exception.MembroNotFoundException;
import missaopraiadacosta.juventude.model.Membro;
import missaopraiadacosta.juventude.service.MembroService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MembroController.class)
@ActiveProfiles("test")
class MembroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MembroService membroService;

    @Test
    void deveBuscarMembroPorId() throws Exception {
        // Given
        Membro membro = new Membro();
        membro.setId(1);
        membro.setNome("João Silva");
        membro.setAtivo(true);

        when(membroService.buscarPorId(1)).thenReturn(membro);

        // When & Then
        mockMvc.perform(get("/api/membros/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("João Silva"))
                .andExpect(jsonPath("$.ativo").value(true));
    }

    @Test
    void deveRetornar404QuandoMembroNaoExistir() throws Exception {
        // Given
        when(membroService.buscarPorId(999)).thenThrow(new MembroNotFoundException(999));

        // When & Then
        mockMvc.perform(get("/api/membros/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Membro não encontrado"))
                .andExpect(jsonPath("$.message").value("Membro não encontrado com ID: 999"));
    }
}
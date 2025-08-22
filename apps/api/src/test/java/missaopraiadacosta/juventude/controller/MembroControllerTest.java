package missaopraiadacosta.juventude.controller;

import missaopraiadacosta.juventude.dto.response.MembroResponse;
import missaopraiadacosta.juventude.exception.MembroNotFoundException;
import missaopraiadacosta.juventude.service.MembroService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MembroController.class)
@ActiveProfiles("test")
@Testcontainers
class MembroControllerTest {

    @SuppressWarnings("resource")
    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("juventude_test")
            .withUsername("test")
            .withPassword("test")
            .withReuse(true);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MembroService membroService;

    @Test
    void deveBuscarMembroPorId() throws Exception {
        MembroResponse membroResponse = MembroResponse.builder()
            .id(1)
            .nome("João Silva")
            .ativo(true)
            .build();

        when(membroService.buscarPorId(1)).thenReturn(membroResponse);

        mockMvc.perform(get("/api/membros/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("João Silva"))
                .andExpect(jsonPath("$.ativo").value(true));
    }

    @Test
    void deveRetornar404QuandoMembroNaoExistir() throws Exception {
        when(membroService.buscarPorId(999)).thenThrow(new MembroNotFoundException(999));

        mockMvc.perform(get("/api/membros/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Membro não encontrado"))
                .andExpect(jsonPath("$.message").value("Membro não encontrado com ID: 999"));
    }
}
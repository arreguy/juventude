package missaopraiadacosta.juventude.controller;

import missaopraiadacosta.juventude.dto.MinisterioDto;
import missaopraiadacosta.juventude.model.Ministerio;
import missaopraiadacosta.juventude.service.MinisterioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/ministerios")
@Tag(name = "Ministérios", description = "Gerenciamento de ministérios da juventude")
public class MinisterioController {

    private final MinisterioService ministerioService;

    public MinisterioController(MinisterioService ministerioService) {
        this.ministerioService = ministerioService;
    }

    @GetMapping
    @Operation(summary = "Listar ministérios", description = "Lista todos os ministérios disponíveis")
    public ResponseEntity<List<MinisterioDto>> listarTodos() {
        List<MinisterioDto> ministerios = ministerioService.listarTodos();
        return ResponseEntity.ok(ministerios);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar ministério por ID", description = "Busca um ministério específico pelo ID")
    public ResponseEntity<Ministerio> buscarPorId(@PathVariable Integer id) {
        Ministerio ministerio = ministerioService.buscarPorId(id);
        return ResponseEntity.ok(ministerio);
    }
}

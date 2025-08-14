package missaopraiadacosta.juventude.controller;

import missaopraiadacosta.juventude.dto.MinisterioDto;
import missaopraiadacosta.juventude.model.Ministerio;
import missaopraiadacosta.juventude.service.MinisterioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ministerios")
public class MinisterioController {

    private final MinisterioService ministerioService;

    public MinisterioController(MinisterioService ministerioService) {
        this.ministerioService = ministerioService;
    }

    @GetMapping
    public ResponseEntity<List<MinisterioDto>> listarTodos() {
        List<MinisterioDto> ministerios = ministerioService.listarTodos();
        return ResponseEntity.ok(ministerios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ministerio> buscarPorId(@PathVariable Integer id) {
        return ministerioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

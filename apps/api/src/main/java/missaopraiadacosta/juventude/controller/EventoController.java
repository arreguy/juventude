package missaopraiadacosta.juventude.controller;

import missaopraiadacosta.juventude.dto.CultoDto;
import missaopraiadacosta.juventude.dto.EbdDto;
import missaopraiadacosta.juventude.model.Evento;
import jakarta.validation.Valid;
import missaopraiadacosta.juventude.service.CultoService;
import missaopraiadacosta.juventude.service.EbdService;
import missaopraiadacosta.juventude.service.EventoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@Tag(name = "Eventos", description = "Gerenciamento de eventos da juventude")
public class EventoController {

    private final EventoService eventoService;
    private final CultoService cultoService;
    private final EbdService ebdService;

    public EventoController(EventoService eventoService, CultoService cultoService, EbdService ebdService) {
        this.eventoService = eventoService;
        this.cultoService = cultoService;
        this.ebdService = ebdService;
    }

    @PostMapping("/culto")
    @Operation(summary = "Registrar culto", description = "Registra um novo evento de culto")
    public ResponseEntity<Evento> criarEventoCulto(@Valid @RequestBody CultoDto cultoDto) {
        Evento novoEvento = cultoService.registrarCulto(cultoDto);
        return ResponseEntity.ok(novoEvento);
    }

    @PostMapping("/ebd")
    @Operation(summary = "Registrar EBD", description = "Registra um novo evento de Escola Bíblica Dominical")
    public ResponseEntity<Evento> criarEventoEbd(@Valid @RequestBody EbdDto ebdDto) {
        Evento novoEvento = ebdService.registrarEbd(ebdDto);
        return ResponseEntity.ok(novoEvento);
    }

    @GetMapping
    @Operation(summary = "Listar eventos", description = "Lista todos os eventos registrados")
    public ResponseEntity<List<Evento>> listarTodosEventos() {
        List<Evento> eventos = eventoService.listarTodos();
        return ResponseEntity.ok(eventos);
    }
}

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

import java.util.List;

@RestController
@RequestMapping("/eventos")
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
    public ResponseEntity<Evento> criarEventoCulto(@Valid @RequestBody CultoDto cultoDto) {
        Evento novoEvento = cultoService.registrarCulto(cultoDto);
        return ResponseEntity.ok(novoEvento);
    }

    @PostMapping("/ebd")
    public ResponseEntity<Evento> criarEventoEbd(@Valid @RequestBody EbdDto ebdDto) {
        Evento novoEvento = ebdService.registrarEbd(ebdDto);
        return ResponseEntity.ok(novoEvento);
    }

    @GetMapping
    public List<Evento> listarTodosEventos() {
        return eventoService.listarTodos();
    }
}

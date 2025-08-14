package missaopraiadacosta.juventude.controller;

import jakarta.validation.Valid;
import missaopraiadacosta.juventude.dto.MembroDto;
import missaopraiadacosta.juventude.model.Membro;
import missaopraiadacosta.juventude.service.MembroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/membros")
public class MembroController {

    private final MembroService membroService;

    public MembroController(MembroService membroService) {
        this.membroService = membroService;
    }

    @PostMapping
    public ResponseEntity<Membro> criarMembro(@Valid @RequestBody MembroDto membroDto) {
        try {
            Membro novoMembro = membroService.criarMembro(membroDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoMembro);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Membro>> listarTodos(@RequestParam(required = false) Boolean apenasAtivos) {
        try {
            List<Membro> membros = (apenasAtivos != null && apenasAtivos)
                    ? membroService.listarAtivos()
                    : membroService.listarTodos();
            return ResponseEntity.ok(membros);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Membro> buscarPorId(@PathVariable Integer id) {
        try {
            Optional<Membro> membro = membroService.buscarPorId(id);
            return membro.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Membro> atualizarMembro(@PathVariable Integer id,
                                                  @Valid @RequestBody MembroDto membroDto) {
        try {
            Membro membroAtualizado = membroService.atualizarMembro(id, membroDto);
            return ResponseEntity.ok(membroAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMembro(@PathVariable Integer id) {
        try {
            membroService.deletarMembro(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{id}/inativar")
    public ResponseEntity<Void> inativarMembro(@PathVariable Integer id) {
        try {
            membroService.inativarMembro(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

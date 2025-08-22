package missaopraiadacosta.juventude.controller;

import jakarta.validation.Valid;
import missaopraiadacosta.juventude.dto.MembroDto;
import missaopraiadacosta.juventude.dto.response.MembroResponse;
import missaopraiadacosta.juventude.service.MembroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/membros")
@Tag(name = "Membros", description = "Gerenciamento de membros da juventude")
public class MembroController {

    private final MembroService membroService;

    public MembroController(MembroService membroService) {
        this.membroService = membroService;
    }

    @PostMapping
    @Operation(summary = "Criar novo membro", description = "Cria um novo membro da juventude")
    public ResponseEntity<MembroResponse> criarMembro(@Valid @RequestBody MembroDto membroDto) {
        MembroResponse novoMembro = membroService.criarMembro(membroDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoMembro);
    }

    @GetMapping
    @Operation(summary = "Listar membros", description = "Lista todos os membros ou apenas os ativos")
    public ResponseEntity<List<MembroResponse>> listarTodos(@RequestParam(required = false) Boolean apenasAtivos) {
        List<MembroResponse> membros = (apenasAtivos != null && apenasAtivos)
                ? membroService.listarAtivos()
                : membroService.listarTodos();
        return ResponseEntity.ok(membros);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar membro por ID", description = "Busca um membro específico pelo ID")
    public ResponseEntity<MembroResponse> buscarPorId(@PathVariable Integer id) {
        MembroResponse membro = membroService.buscarPorId(id);
        return ResponseEntity.ok(membro);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar membro", description = "Atualiza os dados de um membro existente")
    public ResponseEntity<MembroResponse> atualizarMembro(@PathVariable Integer id,
                                                          @Valid @RequestBody MembroDto membroDto) {
        MembroResponse membroAtualizado = membroService.atualizarMembro(id, membroDto);
        return ResponseEntity.ok(membroAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar membro", description = "Remove um membro do sistema")
    public ResponseEntity<Void> deletarMembro(@PathVariable Integer id) {
        membroService.deletarMembro(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/inativar")
    @Operation(summary = "Inativar membro", description = "Marca um membro como inativo")
    public ResponseEntity<Void> inativarMembro(@PathVariable Integer id) {
        membroService.inativarMembro(id);
        return ResponseEntity.ok().build();
    }
}

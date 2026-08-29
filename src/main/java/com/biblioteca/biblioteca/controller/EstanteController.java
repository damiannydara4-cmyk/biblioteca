package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.dto.AtualizarStatusRequest;
import com.biblioteca.biblioteca.model.Estante;
import com.biblioteca.biblioteca.service.EstanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
/*import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;*/



@RestController
@RequestMapping("/estante")
@CrossOrigin(origins = "*") // permite requisições do frontend

public class EstanteController {

 @Autowired // Injeção de dependência: o Spring instancia e gerencia o EstanteService automaticamente
    private EstanteService estanteService;
    
    @GetMapping // Mapeia requisições HTTP GET para a raiz da rota (/estante)
    public List<Estante> listar() {
        // Chama o service para buscar todos os livros salvos e retorna a lista
        return estanteService.listarEstante(); 
    }

    @PostMapping // Mapeia requisições HTTP POST para cadastrar um novo livro na estante (/estante)
    public ResponseEntity<?> salvar(@RequestBody Estante livro){
        try {
            // Recebe os dados do corpo da requisição e salva através do service
            Estante novoLivro = estanteService.salvarLivro(livro);  
            // Retorna o status HTTP 201 (Created) junto com o objeto salvo
            return ResponseEntity.status(HttpStatus.CREATED).body(novoLivro);
        } catch (RuntimeException e) {
            // Caso ocorra algum erro de negócio, retorna status 400 (Bad Request) com a mensagem de erro
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}") // Mapeia requisições HTTP DELETE passando um ID dinâmico na URL (ex: /estante/1)
    public ResponseEntity<Void> remover(@PathVariable Long id) { 
        // @PathVariable pega o valor do {id} da URL e joga na variável 'id' do método
        estanteService.removerLivro(id);
        // Retorna status HTTP 204 (No Content), indicando que a exclusão deu certo e não precisa retornar corpo
        return ResponseEntity.noContent().build(); 
    }
    @PatchMapping("/{id}")
        public ResponseEntity<?> atualizarStatus(@PathVariable Long id, @RequestBody AtualizarStatusRequest request) {
        try {
            Estante atualizado = estanteService.atualizarStatus(id, request.statusLeitura());
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
}
}
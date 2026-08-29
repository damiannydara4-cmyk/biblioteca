package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.dto.GoogleBookDto;
import com.biblioteca.biblioteca.dto.GoogleBooksResponse;
import com.biblioteca.biblioteca.service.GoogleBooksClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/livros")
@CrossOrigin(origins = "*")
public class LivroController {

    @Autowired // Injeta o cliente responsável por se comunicar com a API do Google Books
    private GoogleBooksClient googleBooksClient;

    @GetMapping // Mapeia requisições GET em /livros (ex: /livros?busca=Harry+Potter)
    public ResponseEntity<List<GoogleBookDto>> pesquisar(@RequestParam String busca) {
        // @RequestParam captura o parâmetro 'busca' enviado via query string pelo JavaScript
        
        // Faz a chamada para a API externa através do service/client configurado
        GoogleBooksResponse response = googleBooksClient.pesquisarLivrosNaApi(busca);
        
        // Valida se a resposta veio vazia ou nula para evitar erros de ponteiro nulo (NullPointerException)
        if (response == null || response.items() == null) {
            // Retorna uma lista vazia com status 200 OK se nenhum livro for encontrado
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Retorna a lista de livros encontrada com status 200 OK
        return ResponseEntity.ok(response.items());
    }
}
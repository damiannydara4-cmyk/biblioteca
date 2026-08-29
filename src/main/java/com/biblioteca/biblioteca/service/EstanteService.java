package com.biblioteca.biblioteca.service;

import java.util.NoSuchElementException;
import com.biblioteca.biblioteca.model.Estante;
import com.biblioteca.biblioteca.model.StatusLeitura;
import com.biblioteca.biblioteca.repository.EstanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EstanteService {

    @Autowired
    private EstanteRepository estanteRepository;

    public List<Estante> listarEstante() {
        return estanteRepository.findAll();
    }

    public Estante salvarLivro(Estante livro) {
        return estanteRepository.save(livro);
    }

    public void removerLivro(Long id) {
        estanteRepository.deleteById(id);
    }
    
    public Estante atualizarStatus(Long id, String novoStatus){
        Estante livro = estanteRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Livro não encontrado na Estante"));

        livro.setStatusLeitura(StatusLeitura.valueOf(novoStatus));
        return estanteRepository.save(livro);
    }
}
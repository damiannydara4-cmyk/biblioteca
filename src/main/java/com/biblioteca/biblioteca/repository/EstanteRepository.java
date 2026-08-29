package com.biblioteca.biblioteca.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.biblioteca.biblioteca.model.Estante; 

import java.util.Optional;

@Repository
public interface EstanteRepository extends JpaRepository<Estante, Long> {
    
    // Método útil para verificar se o livro já foi adicionado antes
    Optional<Estante> findByGoogleBookId(String googleBookId);
}
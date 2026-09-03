package com.biblioteca.biblioteca.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class AvaliacaoRequest {
    @Min(1) @Max(5)
    private Integer nota;
    private String resenha;
    // getters e setters

    public Integer getNota() {
    return nota;
}

public String getResenha() {
    return resenha;
}
}
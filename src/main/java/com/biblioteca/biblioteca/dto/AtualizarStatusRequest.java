package com.biblioteca.biblioteca.dto;

public record AtualizarStatusRequest(
    String statusLeitura // "QUERO_LER", "LENDO" ou "LIDO"
) {}
package com.biblioteca.biblioteca.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GoogleBookDto(
    String id,
    VolumeInfo volumeInfo
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record VolumeInfo(
        String title,
        List<String> authors,
        String description,
        ImageLinks imageLinks
    ) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        public record ImageLinks(
            String thumbnail
        ) {}
    }
}
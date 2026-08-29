package com.biblioteca.biblioteca.service;

import com.biblioteca.biblioteca.dto.GoogleBooksResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GoogleBooksClient {

 private final String API_URL = "https://www.googleapis.com/books/v1/volumes?q=";
 
    @Value("${google.books.api.key}")
    private String apiKey;

    public GoogleBooksResponse pesquisarLivrosNaApi(String termoBusca) {
        RestTemplate restTemplate = new RestTemplate();
        String url = API_URL + termoBusca.replace(" ", "+") + "&key=" + apiKey;

        try {
            return restTemplate.getForObject(url, GoogleBooksResponse.class);
        } catch (Exception e) {
            System.err.println("Erro ao chamar a API do Google Books: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
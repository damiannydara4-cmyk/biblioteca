package com.biblioteca.biblioteca;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera todas as rotas (/estante, /livros, etc.)
                .allowedOrigins("http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:9000") // Libera o Live Server e o localhost
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Libera os métodos HTTP
                .allowedHeaders("*");
    }
}
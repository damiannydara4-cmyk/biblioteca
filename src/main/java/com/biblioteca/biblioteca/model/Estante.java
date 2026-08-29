package com.biblioteca.biblioteca.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity  /*representa uma tabela no banco de dados. A classe estante será transformada em uma tabela. */
@Table(name = "estante")
@Data /*evita que  tenha que escrever manualmente vários métodos */
@NoArgsConstructor/*esses dois criam os construtores */
@AllArgsConstructor
public class Estante {

    @Id /*identificador do livro no banco */
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String googleBookId; // evita duplicidade do mesmo livro na estante

    @Column(nullable = false)
    private String titulo;

    private String autor;

    @Column(length = 1000)
    private String sinopse;

    private String capa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusLeitura statusLeitura;

    private LocalDate dataAdicao = LocalDate.now(); /*guarda a data em que o livro foi guardado */
}



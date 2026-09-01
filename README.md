# 📚 Minha Biblioteca Pessoal

Aplicação web para organizar sua estante pessoal de livros, com busca de títulos via **Google Books API**, controle de status de leitura (quero ler / lendo / lido) e uma interface com visual rústico de biblioteca.

## Funcionalidades

- Pesquisa de livros (título/autor) integrada à API do Google Books
- Estante pessoal com CRUD (adicionar, listar, atualizar status, remover)
- Filtros por status de leitura (Todos / Quero ler / Lendo / Lidos) com contadores (badges)
- Busca interna para filtrar livros já adicionados à estante
- Ordenação da estante (título, autor, mais recentes)
- Modal com detalhes do livro (autor, editora, data de publicação, páginas, sinopse)
- Notificações via toasts (sucesso, erro, info)
- Estados de carregamento com spinner e skeleton cards

## Tecnologias

**Back-end**
- Java 17
- Spring Boot 4.1.1
- Spring Data JPA
- H2 Database
- Lombok

**Front-end**
- HTML5
- CSS3
- JavaScript (Vanilla)

**Integração externa**
- [Google Books API](https://developers.google.com/books)

## Estrutura do projeto

```
biblioteca/
├── src/
│   └── main/
│       ├── java/            # Código-fonte do back-end (Spring Boot)
│       └── resources/
│           └── static/      # index.html, style.css, script.js
├── pom.xml
└── README.md
```

## Pré-requisitos

- [Java 17+](https://adoptium.net/)
- Maven (ou o Maven Wrapper incluído no projeto, `mvnw`)
- Navegador atualizado

## Como executar

1. Clone o repositório e acesse a pasta do projeto:

   ```bash
   git clone <url-do-repositorio>
   cd biblioteca
   ```

2. Suba o back-end (Spring Boot):

   ```bash
   ./mvnw spring-boot:run
   ```

   O servidor sobe por padrão em `http://localhost:9000`.

3. Acesse a aplicação no navegador:

   ```
   http://localhost:9000
   ```

   > O front-end (`index.html`, `style.css`, `script.js`) é servido automaticamente pelo Spring Boot a partir de `src/main/resources/static`.

## 🔌 Endpoints da API

| Método | Rota                | Descrição                                  |
|--------|----------------------|---------------------------------------------|
| GET    | `/livros?q={termo}`  | Busca livros na API do Google Books         |
| GET    | `/estante`           | Lista os livros da estante pessoal          |
| POST   | `/estante`           | Adiciona um livro à estante                 |
| PUT    | `/estante/{id}`      | Atualiza status/dados de um livro           |
| DELETE | `/estante/{id}`      | Remove um livro da estante                  |

> Ajuste esta tabela conforme os endpoints reais expostos pelos seus *controllers*.

## Banco de dados

O projeto usa **H2** em memória por padrão. O console do H2 (se habilitado) fica disponível em:

```
http://localhost:9000/h2-console
```

## Interface

A interface segue um tema rústico de biblioteca (tons de bege, marrom-madeira e terracota, tipografia serifada nos títulos), mantendo a mesma estrutura funcional do HTML/JS original.

## Roadmap

- [ ] Progresso de leitura (páginas lidas/total com barra de progresso)
- [ ] Melhorias de responsividade para telas menores

## Licença
MIT LICENSE
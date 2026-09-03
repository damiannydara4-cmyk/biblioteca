const API_ESTANTE = 'http://localhost:9000/estante';
const API_LIVROS = 'http://localhost:9000/livros';

// Variável global para guardar todos os livros da estante
let estanteCompleta = [];

// Variáveis do modal de avaliação
let notaSelecionada = 0;
let livroAtualId = null;

document.addEventListener('DOMContentLoaded', () => {
    carregarEstante();

    // Ativa o clique nos botões de filtro da estante
    document.querySelectorAll(".filtro-btn").forEach(btn => {
        btn.addEventListener("click", () => aplicarFiltro(btn.dataset.status));
    });
});

document.getElementById("select-ordenacao").addEventListener("change", (e) => {
    ordenarEstante(e.target.value);
});

console.log("Script carregado com sucesso!");


// 1. Pesquisar livros na API do Google Books via Backend
async function pesquisarLivros() {
    const termo = document.getElementById('searchInput').value;
    const searchResults = document.getElementById('searchResults');

    if (!termo.trim()) {
        alert('Digite um termo para pesquisar.');
        return;
    }

    mostrarSkeleton("searchResults");

    try {
        const url = `${API_LIVROS}?busca=${encodeURIComponent(termo)}`;
        const response = await fetch(url);

        if (!response.ok) {
            const erroTexto = await response.text();
            throw new Error(`Erro do servidor (${response.status}): ${erroTexto}`);
        }

        const livros = await response.json();

        if (livros.length === 0) {
            searchResults.innerHTML = '<p>Nenhum livro encontrado.</p>';
            return;
        }

        searchResults.innerHTML = '';
        livros.forEach(item => {
            const info = item.volumeInfo || {};
            const titulo = info.title || 'Título desconhecido';
            const autor = info.authors ? info.authors.join(', ') : 'Autor desconhecido';
            const sinopse = info.description ? info.description.substring(0, 120) + '...' : 'Sem sinopse.';
            const capa = info.imageLinks && info.imageLinks.thumbnail ? info.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=Sem+Capa';
            const editora = info.publisher || null;
            const dataPublicacao = info.publishedDate || null;
            const numeroPaginas = info.pageCount || null;

            const card = document.createElement('div');
            card.style.cssText = 'border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px; background: #fafafa;';

            card.innerHTML = `
                <div style="display: flex; gap: 15px;">
                    <img src="${capa}" alt="Capa" style="width: 70px; height: 100px; object-fit: cover;">
                    <div>
                        <h4>${titulo}</h4>
                        <p><strong>Autor:</strong> ${autor}</p>
                        <p style="font-size: 13px; color: #555;">${sinopse}</p>
                        <button onclick='adicionarEstante("${item.id}", ${JSON.stringify(titulo)}, ${JSON.stringify(autor)}, ${JSON.stringify(sinopse)}, ${JSON.stringify(capa)}, ${JSON.stringify(editora)}, ${JSON.stringify(dataPublicacao)}, ${numeroPaginas})' style="background: #28a745; color: white; border: none; padding: 6px 12px; cursor: pointer; border-radius: 4px;">Adicionar à Estante (Quero Ler)</button>
                    </div>
                </div>
            `;
            searchResults.appendChild(card);
        });

    } catch (error) {
        console.error("Erro capturado:", error);
        searchResults.innerHTML = `<p style="color: red;">Erro ao buscar livros: ${error.message}</p>`;
    }
}

// 2. Salvar livro na estante (POST /estante)
async function adicionarEstante(googleBookId, titulo, autor, sinopse, capa, editora, dataPublicacao, numeroPaginas) {
    const novoLivro = {
        googleBookId: googleBookId,
        titulo: titulo,
        autor: autor,
        sinopse: sinopse,
        capa: capa,
        editora: editora,
        dataPublicacao: dataPublicacao,
        numeroPaginas: numeroPaginas,
        statusLeitura: 'QUERO_LER'
    };

    try {
        const response = await fetch(API_ESTANTE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoLivro)
        });

        if (response.ok) {
            mostrarToast("Livro adicionado com sucesso!");
            carregarEstante();
        } else {
            const mensagemErro = await response.text();
            alert('Aviso: ' + mensagemErro);
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao conectar com o servidor.');
    }
}

// 3. Carregar estante pessoal (GET /estante)
async function carregarEstante() {
    const shelfResults = document.getElementById('shelfResults');
    mostrarSkeleton('shelfResults', 2);

    try {
        const response = await fetch(API_ESTANTE);
        if (!response.ok) {
            mostrarToast("Erro ao buscar estante.", "error");
            throw new Error("Erro ao carregar estante do servidor.");
        }

        estanteCompleta = await response.json();

        atualizarBadges();
        aplicarFiltro("TODOS");

    } catch (error) {
        console.error(error);
        shelfResults.innerHTML = '<p style="color: red;">Erro ao conectar com o servidor.</p>';
    }
}

// 4. Remover livro da estante (DELETE /estante/{id})
async function removerLivro(id) {
    if (!confirm('Deseja realmente remover este livro?')) return;

    try {
        const response = await fetch(`${API_ESTANTE}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            mostrarToast("Livro removido com sucesso!");
            carregarEstante();
        } else {
            alert('Erro ao remover o livro.');
        }
    } catch (error) {
        console.error(error);
    }
}

// 5. Atualizar status de leitura (PATCH /estante/{id})
async function atualizarStatusLeitura(id, novoStatus) {
    try {
        const response = await fetch(`${API_ESTANTE}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statusLeitura: novoStatus })
        });
        if (!response.ok) {
            const erro = await response.text();
            alert('Erro ao atualizar status: ' + erro);
            carregarEstante();
        } else {
            mostrarToast("Status atualizado!");
            // Atualiza os dados locais e recalcula badges/filtros sem perder a posição
            const livroModificado = estanteCompleta.find(l => l.id === id);
            if (livroModificado) livroModificado.statusLeitura = novoStatus;
            atualizarBadges();
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao conectar com o servidor.');
    }
}

// 6. Salvar avaliação (nota + resenha) — PUT /estante/{id}/avaliacao
async function salvarAvaliacao() {
    const resenha = document.getElementById('modal-resenha').value;

    try {
        const response = await fetch(`${API_ESTANTE}/${livroAtualId}/avaliacao`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nota: notaSelecionada, resenha })
        });

        if (!response.ok) {
            const erroTexto = await response.text();
            throw new Error(erroTexto || 'Falha ao salvar avaliação');
        }

        const livroAtualizado = await response.json();

        // Atualiza os dados locais sem precisar recarregar tudo do servidor
        const idx = estanteCompleta.findIndex(l => l.id === livroAtualId);
        if (idx !== -1) estanteCompleta[idx] = livroAtualizado;

        mostrarToast('Avaliação salva com sucesso!');

        const botaoAtivo = document.querySelector(".filtro-btn.ativo");
        aplicarFiltro(botaoAtivo ? botaoAtivo.dataset.status : "TODOS");

    } catch (error) {
        console.error(error);
        mostrarToast('Erro ao salvar avaliação', 'error');
    }
}

function mostrarToast(mensagem, tipo = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.textContent = mensagem;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Skeleton
function mostrarSkeleton(containerId, quantidade = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = Array(quantidade)
        .fill('<div class="skeleton-card"></div>')
        .join("");
}

// Aplicar Filtro
function aplicarFiltro(status) {
    document.querySelectorAll(".filtro-btn").forEach(btn =>
        btn.classList.toggle("ativo", btn.dataset.status === status)
    );

    const filtrados = status === "TODOS"
        ? estanteCompleta
        : estanteCompleta.filter(livro => {
            const statusLivro = (livro.statusLeitura || "").trim().toUpperCase().replace(/[\s_]+/g, "");
            const statusAlvo = status.trim().toUpperCase().replace(/[\s_]+/g, "");
            return statusLivro === statusAlvo;
        });

    renderizarEstanteFiltrada(filtrados);
}

// Renderizar Estante com suporte ao Modal no clique do card
function renderizarEstanteFiltrada(livros) {
    const shelfResults = document.getElementById('shelfResults');

    if (livros.length === 0) {
        shelfResults.innerHTML = '<p>Nenhum livro encontrado para este filtro.</p>';
        return;
    }

    shelfResults.innerHTML = '';
    livros.forEach(livro => {
        const card = document.createElement('div');
        card.style.cssText = 'border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px; display: flex; gap: 15px; align-items: center; background: #fff; cursor: pointer;';

        const notaTexto = livro.nota ? '★'.repeat(livro.nota) + '☆'.repeat(5 - livro.nota) : '';

        card.innerHTML = `
            <img src="${livro.capa || 'https://via.placeholder.com/50x75'}" alt="Capa" style="width: 50px; height: 75px; object-fit: cover;">
            <div style="flex-grow: 1;">
                <h4 style="margin: 0 0 5px 0;">${livro.titulo}</h4>
                <p style="margin: 0 0 5px 0; font-size: 13px;"><strong>Autor:</strong> ${livro.autor || 'Desconhecido'}</p>
                ${notaTexto ? `<p style="margin: 0 0 5px 0; font-size: 13px; color: #9e4133;">${notaTexto}</p>` : ''}
                <label style="font-size: 12px;"><strong>Status:</strong>
                    <select onchange="atualizarStatusLeitura(${livro.id}, this.value)">
                        <option value="QUERO_LER" ${livro.statusLeitura === 'QUERO_LER' ? 'selected' : ''}>Quero Ler</option>
                        <option value="LENDO" ${livro.statusLeitura === 'LENDO' ? 'selected' : ''}>Lendo</option>
                        <option value="LIDO" ${livro.statusLeitura === 'LIDO' ? 'selected' : ''}>Lido</option>
                    </select>
                </label>
            </div>
            <button onclick="removerLivro(${livro.id})" style="background: #dc3545; color: white; border: none; padding: 6px 10px; cursor: pointer; border-radius: 4px;">Remover</button>
        `;

        // Adiciona o evento de clique no card inteiro para abrir o modal (ignorando botão e select)
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') return;
            abrirModal(livro);
        });

        shelfResults.appendChild(card);
    });
}

// Atualizar Badges
function atualizarBadges() {
    const total = estanteCompleta.length;
    const queroLer = estanteCompleta.filter(l => l.statusLeitura === 'QUERO LER' || l.statusLeitura === 'QUERO_LER').length;
    const lendo = estanteCompleta.filter(l => l.statusLeitura === 'LENDO').length;
    const lido = estanteCompleta.filter(l => l.statusLeitura === 'LIDO').length;

    if (document.getElementById("badge-TODOS")) document.getElementById("badge-TODOS").textContent = `(${total})`;
    if (document.getElementById("badge-QUERO_LER")) document.getElementById("badge-QUERO_LER").textContent = `(${queroLer})`;
    if (document.getElementById("badge-LENDO")) document.getElementById("badge-LENDO").textContent = `(${lendo})`;
    if (document.getElementById("badge-LIDO")) document.getElementById("badge-LIDO").textContent = `(${lido})`;
}

// Ordenação personalizada
function ordenarEstante(criterio) {
    const botaoAtivo = document.querySelector(".filtro-btn.ativo");
    const statusAtivo = botaoAtivo ? botaoAtivo.dataset.status : "TODOS";

    let lista = statusAtivo === "TODOS"
        ? [...estanteCompleta]
        : estanteCompleta.filter(l => {
            const statusLivro = (l.statusLeitura || "").trim().toUpperCase().replace(/[\s_]+/g, "");
            const statusAlvo = statusAtivo.trim().toUpperCase().replace(/[\s_]+/g, "");
            return statusLivro === statusAlvo;
        });

    lista.sort((a, b) => {
        if (criterio === "dataAdicao") {
            return (b.id || 0) - (a.id || 0);
        }

        const valorA = (a[criterio] || "").toString();
        const valorB = (b[criterio] || "").toString();

        return valorA.localeCompare(valorB, 'pt-BR', { sensitivity: 'accent' });
    });

    renderizarEstanteFiltrada(lista);
}

// Funções do Modal
function abrirModal(livro) {
    livroAtualId = livro.id;
    notaSelecionada = livro.nota || 0;
    document.getElementById("modal-titulo").textContent = livro.titulo || "Título não informado";
    document.getElementById("modal-autor").textContent = livro.autor || "Desconhecido";
    document.getElementById("modal-editora").textContent = livro.editora ?? "—";
    document.getElementById("modal-data").textContent = livro.dataPublicacao ?? "—";
    document.getElementById("modal-paginas").textContent = livro.numeroPaginas ?? "—";
    document.getElementById("modal-sinopse").textContent = livro.sinopse ?? "Sinopse não disponível.";
    document.getElementById('modal-resenha').value = livro.resenha || '';
    document.getElementById("modal-livro").classList.remove("oculto");
    atualizarEstrelas(notaSelecionada);
}

document.getElementById("fechar-modal").addEventListener("click", () => {
    document.getElementById("modal-livro").classList.add("oculto");
});

document.getElementById("modal-livro").addEventListener("click", (e) => {
    if (e.target.id === "modal-livro") {
        e.target.classList.add("oculto");
    }
});

// Para somente buscas dentro da estante
document.getElementById("busca-interna").addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase().trim();
    const botaoAtivo = document.querySelector(".filtro-btn.ativo");
    const statusAtivo = botaoAtivo ? botaoAtivo.dataset.status : "TODOS";

    let lista = statusAtivo === "TODOS"
        ? estanteCompleta
        : estanteCompleta.filter(l => {
            const statusLivro = (l.statusLeitura || "").trim().toUpperCase().replace(/[\s_]+/g, "");
            const statusAlvo = statusAtivo.trim().toUpperCase().replace(/[\s_]+/g, "");
            return statusLivro === statusAlvo;
        });

    const filtrados = lista.filter(l => {
        const titulo = (l.titulo || "").toLowerCase();
        const autor = (l.autor || "").toLowerCase();
        return titulo.includes(termo) || autor.includes(termo);
    });

    renderizarEstanteFiltrada(filtrados);
});

// Avaliação: estrelas
function atualizarEstrelas(nota) {
    document.querySelectorAll('.estrela').forEach(el => {
        el.classList.toggle('selecionada', Number(el.dataset.valor) <= nota);
    });
}

document.querySelectorAll('.estrela').forEach(el => {
    el.addEventListener('click', () => {
        notaSelecionada = Number(el.dataset.valor);
        atualizarEstrelas(notaSelecionada);
    });
});

document.getElementById('btn-salvar-avaliacao').addEventListener('click', salvarAvaliacao);
const API_ESTANTE = 'http://localhost:9000/estante';
const API_LIVROS = 'http://localhost:9000/livros';

document.addEventListener('DOMContentLoaded', () => {
    carregarEstante();
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
    
    // Corrigido para o ID correto do HTML ("searchResults")
    mostrarSkeleton("searchResults");

    try {
        const url = `${API_LIVROS}?busca=${encodeURIComponent(termo)}`;
        console.log("Fazendo fetch para:", url);

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

            const card = document.createElement('div');
            card.style.cssText = 'border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px; background: #fafafa;';

            card.innerHTML = `
                <div style="display: flex; gap: 15px;">
                    <img src="${capa}" alt="Capa" style="width: 70px; height: 100px; object-fit: cover;">
                    <div>
                        <h4>${titulo}</h4>
                        <p><strong>Autor:</strong> ${autor}</p>
                        <p style="font-size: 13px; color: #555;">${sinopse}</p>
                        <button onclick='adicionarEstante("${item.id}", ${JSON.stringify(titulo)}, ${JSON.stringify(autor)}, ${JSON.stringify(sinopse)}, ${JSON.stringify(capa)})' style="background: #28a745; color: white; border: none; padding: 6px 12px; cursor: pointer; border-radius: 4px;">Adicionar à Estante (Quero Ler)</button>
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
async function adicionarEstante(googleBookId, titulo, autor, sinopse, capa) {
    const novoLivro = {
        googleBookId: googleBookId,
        titulo: titulo,
        autor: autor,
        sinopse: sinopse,
        capa: capa,
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
        
        const livros = await response.json();

        if (livros.length === 0) {
            shelfResults.innerHTML = '<p>Sua estante está vazia.</p>';
            return;
        }

        shelfResults.innerHTML = '';
        livros.forEach(livro => {
            const card = document.createElement('div');
            card.style.cssText = 'border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px; display: flex; gap: 15px; align-items: center;';

            card.innerHTML = `
                <img src="${livro.capa || 'https://via.placeholder.com/50x75'}" alt="Capa" style="width: 50px; height: 75px; object-fit: cover;">
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0 0 5px 0;">${livro.titulo}</h4>
                    <p style="margin: 0 0 5px 0; font-size: 13px;"><strong>Autor:</strong> ${livro.autor || 'Desconhecido'}</p>
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
            shelfResults.appendChild(card);
        });

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
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao conectar com o servidor.');
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

function mostrarSkeleton(containerId, quantidade = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = Array(quantidade)
        .fill('<div class="skeleton-card"></div>')
        .join("");
}
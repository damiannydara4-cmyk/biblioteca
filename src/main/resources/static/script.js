const API_URL = 'http://localhost:8080/estante';

document.addEventListener("DOMContentLoaded", () => {   /*executada assim que a página carrega*/
    carregarEstante();
 });

 async function carregarEstante() {
    const shelfResults = document.getElementById('shelfResults');
    shelfResults.innerHTML = '<p>Carregando estante...</p>';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao carregar a estante');

        const livros = await response.json();
        
        if (livros.length === 0) {
            shelfResults.innerHTML = '<p>Sua estante está vazia.</p>';
            return;
        }

        shelfResults.innerHTML = '';  /*criou um local onde vai haver uma substituição*/ 
        livros.forEach(livro => {
            const card = document.createElement('div');
            card.style.border = '1px solid #ccc';
            card.style.padding = '10px';
            card.style.marginBottom = '10px';
            card.style.borderRadius = '5px';
            
            card.innerHTML = `
                <h3>${livro.titulo}</h3>
                <p><strong>Autor:</strong> ${livro.autor || 'Desconhecido'}</p>
                <p><strong>Status:</strong> ${livro.statusLeitura}</p>
                <button onclick="removerLivro(${livro.id})" style="background: #ff4d4d; color: white; border: none; padding: 5px 10px; cursor: pointer;">Remover</button>
            `;
            shelfResults.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        shelfResults.innerHTML = '<p style="color: red;">Erro ao conectar com o servidor.</p>';
    }
} 

    // Função para remover livro da estante
async function removerLivro(id) {
    if (!confirm('Deseja realmente remover este livro?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            carregarEstante(); // Recarrega a lista
        } else {
            alert('Erro ao remover o livro.');
        }
    } catch (error) {
        console.error(error);
    }
}

function pesquisarLivros() {
    const termo = document.getElementById('searchInput').value;
    console.log("Pesquisando por:", termo);
    
}


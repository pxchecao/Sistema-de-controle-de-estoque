// Array para armazenar os itens de estoque.
// Usamos um array de objetos para simular o armazenamento de dados (como um banco de dados)
let estoque = [];

// Funções utilitárias
const getElement = (id) => document.getElementById(id);
const getQuery = (selector) => document.querySelector(selector);

// Elementos DOM
const formCadastro = getElement('cadastro-form');
const tabelaEstoqueBody = getQuery('#tabela-estoque tbody');
const listaAlertas = getElement('lista-alertas');

// --- Funções de Lógica de Negócio ---

/**
 * Adiciona um novo item ao estoque.
 * @param {object} item - O objeto do novo item a ser adicionado.
 */
function adicionarItem(item) {
    // Gera um ID único simples
    item.id = Date.now();
    item.quantidade = parseInt(item.quantidade);
    item.limiteAlerta = parseInt(item.limiteAlerta);
    estoque.push(item);
    renderizarEstoque();
    verificarAlertas();
}

/**
 * Atualiza a quantidade de um item no estoque (entrada/saída).
 * @param {number} id - O ID do produto.
 * @param {number} delta - A mudança na quantidade (positivo para entrada, negativo para saída).
 */
function atualizarQuantidade(id, delta) {
    const item = estoque.find(i => i.id === id);
    if (item) {
        // Assegura que a quantidade nunca seja negativa
        item.quantidade = Math.max(0, item.quantidade + delta);
        renderizarEstoque();
        verificarAlertas();
    }
}

// --- Funções de Renderização (Atualização da Interface) ---

/**
 * Renderiza a tabela de estoque completa.
 */
function renderizarEstoque() {
    tabelaEstoqueBody.innerHTML = ''; // Limpa a tabela

    if (estoque.length === 0) {
        tabelaEstoqueBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum item registrado no estoque ainda.</td></tr>';
        return;
    }

    estoque.forEach(item => {
        const row = tabelaEstoqueBody.insertRow();
        const isLow = item.quantidade <= item.limiteAlerta;

        row.className = isLow ? 'low-stock' : ''; // Adiciona classe para destaque visual
        
        row.insertCell().textContent = item.nome;
        row.insertCell().textContent = `${item.marca} / ${item.modelo}`;
        row.insertCell().textContent = item.caracteristicas;
        row.insertCell().textContent = item.quantidade;
        row.insertCell().textContent = item.limiteAlerta;

        const acoesCell = row.insertCell();
        acoesCell.innerHTML = `
            <button class="acao-btn entrada-btn" onclick="atualizarQuantidade(${item.id}, 1)">+ Entrada</button>
            <button class="acao-btn saida-btn" onclick="atualizarQuantidade(${item.id}, -1)">- Saída</button>
        `;
    });
}

/**
 * Verifica os níveis de estoque e renderiza os alertas.
 */
function verificarAlertas() {
    listaAlertas.innerHTML = '';
    
    // Filtra os itens onde a quantidade atual é menor ou igual ao limite configurável 
    const itensComAlerta = estoque.filter(item => item.quantidade <= item.limiteAlerta);

    if (itensComAlerta.length === 0) {
        listaAlertas.innerHTML = '<li>Nenhum alerta de estoque baixo no momento.</li>';
        return;
    }

    // Cria um item de lista para cada alerta
    itensComAlerta.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item-alerta';
        li.textContent = `🚨 ALERTA: ${item.nome} (${item.marca}) está em ${item.quantidade}. Limite: ${item.limiteAlerta}.`;
        listaAlertas.appendChild(li);
    });
}

// --- Event Listeners (Tratamento de Eventos) ---

/**
 * Lida com o envio do formulário de cadastro.
 */
formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = getElement('nome').value;
    const marca = getElement('marca').value;
    const modelo = getElement('modelo').value;
    const caracteristicas = getElement('caracteristicas').value; // Detalhes como material do cabo, tensão, etc. 
    const quantidade = getElement('quantidade').value;
    const limiteAlerta = getElement('limite-alerta').value;

    const novoItem = {
        nome,
        marca,
        modelo,
        caracteristicas,
        quantidade,
        limiteAlerta
    };

    adicionarItem(novoItem);
    formCadastro.reset(); // Limpa o formulário após o registro
});

// Inicialização: carrega o estado inicial (vazio) e checa alertas
document.addEventListener('DOMContentLoaded', () => {
    // Exemplo de item inicial para teste
    adicionarItem({
        nome: "Martelo de Unha 1kg MASTER",
        marca: "MASTER",
        modelo: "Perfil Reto",
        caracteristicas: "Cabo Tubular, Aço Carbono, 1kg [cite: 8]",
        quantidade: 4,
        limiteAlerta: 5
    });
    
    // Remove o item de teste para começar com uma lista limpa, se preferir
    // estoque = [];
    // renderizarEstoque();
    // verificarAlertas();
});
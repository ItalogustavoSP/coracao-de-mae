// Carrinho de Compras
let carrinho = [];

// Função para atualizar o carrinho na interface
function atualizarCarrinho() {
    const carrinhoContainer = document.querySelector('#itens-carrinho');
    const totalElement = document.querySelector('#total');
    
    // Limpa o conteúdo atual do carrinho
    carrinhoContainer.innerHTML = '';
    
    // Calcula o total do carrinho
    let total = 0;
    
    // Adiciona cada item do carrinho à lista
    carrinho.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}`;
        
        // Botão para remover item do carrinho
        const removerBtn = document.createElement('button');
        removerBtn.textContent = 'Remover';
        removerBtn.classList.add('btn-remover');
        removerBtn.addEventListener('click', () => removerItemDoCarrinho(index));
        
        li.appendChild(removerBtn);
        carrinhoContainer.appendChild(li);
        
        // Atualiza o total
        total += item.preco * item.quantidade;
    });
    
    // Exibe o total
    totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Função para adicionar item ao carrinho
function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    
    if (itemExistente) {
        // Se o item já existe, aumenta a quantidade
        itemExistente.quantidade++;
    } else {
        // Se o item não existe, adiciona ao carrinho
        carrinho.push({ nome, preco, quantidade: 1 });
    }
    
    // Atualiza a interface do carrinho
    atualizarCarrinho();
}

// Função para remover item do carrinho
function removerItemDoCarrinho(index) {
    carrinho.splice(index, 1); // Remove o item do array
    atualizarCarrinho(); // Atualiza a interface
}

// Finalizar compra e redirecionar para a sessão de pagamento
document.querySelector('#finalizar-compra').addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
    } else {
        // Rola a página até a seção de pagamento
        const pagamentoSection = document.querySelector('#pagamento');
        if (pagamentoSection) {
            pagamentoSection.scrollIntoView({ behavior: 'smooth' }); // Rola suavemente
        } else {
            console.error('Seção de pagamento não encontrada!');
        }
    }
});

// Adicionar evento de clique aos itens do cardápio (apenas uma vez)
document.querySelectorAll('.menu-item').forEach(item => {
    // Remove qualquer evento de clique existente para evitar duplicação
    item.removeEventListener('click', handleItemClick);
    
    // Adiciona o evento de clique
    item.addEventListener('click', handleItemClick);
});

// Função para lidar com o clique nos itens do cardápio
function handleItemClick() {
    const nome = this.querySelector('h3').textContent;
    const preco = parseFloat(this.querySelector('.price').textContent.replace('R$ ', ''));
    adicionarAoCarrinho(nome, preco);
}

// Mostrar campos de pagamento dinamicamente
const formaPagamento = document.querySelector('#forma-pagamento');
const camposCartao = document.querySelector('#campos-cartao');
const camposVrVa = document.querySelector('#campos-vr-va');

formaPagamento.addEventListener('change', () => {
    const valorSelecionado = formaPagamento.value;

    // Oculta todos os campos
    camposCartao.classList.remove('active');
    camposVrVa.classList.remove('active');

    // Mostra os campos correspondentes
    if (valorSelecionado === 'debito' || valorSelecionado === 'credito') {
        camposCartao.classList.add('active');
    } else if (valorSelecionado === 'vr' || valorSelecionado === 'va') {
        camposVrVa.classList.add('active');
    }
});

// Finalizar pagamento (exemplo simples)
document.querySelector('#form-pagamento').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Pagamento realizado com sucesso! Obrigado pela preferência.');
    carrinho = []; // Limpa o carrinho
    atualizarCarrinho(); // Atualiza a interface
});

// Menu Responsivo
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Carrossel Automático
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 5000);

// Abas do Cardápio
const tabButtons = document.querySelectorAll('.tab-button');
const menuCategories = document.querySelectorAll('.menu-category');

tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
        tabButtons.forEach((btn) => btn.classList.remove('active'));
        menuCategories.forEach((category) => category.classList.remove('active'));

        button.classList.add('active');
        const category = button.getAttribute('data-category');
        document.querySelector(`.menu-category.${category}`).classList.add('active');
    });
});

// Animação ao Rolagem (Scroll)
window.addEventListener('scroll', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item) => {
        const itemTop = item.getBoundingClientRect().top;
        if (itemTop < window.innerHeight * 0.8) {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
});

// Observador para animações do mapa
const mapContainer = document.querySelector('.map-container');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.5 });

observer.observe(mapContainer);

// Efeito de digitação no slogan
function typeWriter(element) {
    const text = element.textContent;
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    type();
}

document.querySelector('.slogan').style.visibility = 'hidden';
setTimeout(() => {
    const slogan = document.querySelector('.slogan');
    slogan.style.visibility = 'visible';
    typeWriter(slogan);
}, 1000);

// Efeito de flutuação na logo
const logoAnimado = document.querySelector('.logo-animado');
logoAnimado.addEventListener('mouseover', () => {
    logoAnimado.style.animation = 'pulse 1.5s infinite';
});

logoAnimado.addEventListener('mouseout', () => {
    logoAnimado.style.animation = '';
});

// Fechar menu ao clicar em link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

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

// Adicionar evento de clique aos itens do cardápio
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const nome = item.querySelector('h3').textContent;
        const preco = parseFloat(item.querySelector('.price').textContent.replace('R$ ', ''));
        adicionarAoCarrinho(nome, preco);
    });
});

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

// Adicionar evento de clique aos itens do cardápio
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const nome = item.querySelector('h3').textContent;
        const preco = parseFloat(item.querySelector('.price').textContent.replace('R$ ', ''));
        adicionarAoCarrinho(nome, preco);
    });
});

// Finalizar compra e redirecionar para a sessão de pagamento
document.querySelector('#finalizar-compra').addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
    } else {
        // Redireciona para a sessão de pagamento
        window.location.href = '#pagamento';
    }
});

// Cadastro de Cliente
document.querySelector('#form-cadastro').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.querySelector('#nome').value;
    const email = document.querySelector('#email').value;
    const telefone = document.querySelector('#telefone').value;
    const endereco = document.querySelector('#endereco').value;
    
    alert(`Cadastro realizado com sucesso! Bem-vindo, ${nome}!`);
    document.querySelector('#form-cadastro').reset();
});

// Sistema de Pagamento
document.querySelector('#form-pagamento').addEventListener('submit', (e) => {
    e.preventDefault();
    const formaPagamento = document.querySelector('#forma-pagamento').value;
    alert(`Pagamento realizado com sucesso via ${formaPagamento}!`);
});

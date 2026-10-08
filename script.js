/* =========================================================
CORAÇÃO DE MÃE
JavaScript — ATUALIZADO 2026 - NEM LEMBRAVA MAIS DISSO AQUI KKKKKKKK
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

```
/* =====================================================
   ELEMENTOS PRINCIPAIS
   ===================================================== */

const body = document.body;

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const tabButtons = document.querySelectorAll('.tab-button');
const menuCategories = document.querySelectorAll('.menu-category');
const menuItems = document.querySelectorAll('.menu-item');

const carrinhoContainer = document.querySelector('#itens-carrinho');
const totalElement = document.querySelector('#total');
const finalizarCompraBtn = document.querySelector('#finalizar-compra');

const pagamentoSection = document.querySelector('#pagamento');
const formaPagamento = document.querySelector('#forma-pagamento');

const camposCartao = document.querySelector('#campos-cartao');
const camposVrVa = document.querySelector('#campos-vr-va');

const formPagamento = document.querySelector('#form-pagamento');
const formCadastro = document.querySelector('#form-cadastro');

/* =====================================================
   ESTADO DA APLICAÇÃO
   ===================================================== */

let carrinho = JSON.parse(localStorage.getItem('coracaoDeMaeCarrinho')) || [];

let favoritos = JSON.parse(localStorage.getItem('coracaoDeMaeFavoritos')) || [];

/* =====================================================
   UTILIDADES
   ===================================================== */

function formatarPreco(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function salvarCarrinho() {
    localStorage.setItem(
        'coracaoDeMaeCarrinho',
        JSON.stringify(carrinho)
    );
}

function salvarFavoritos() {
    localStorage.setItem(
        'coracaoDeMaeFavoritos',
        JSON.stringify(favoritos)
    );
}

function mostrarNotificacao(mensagem, tipo = 'sucesso') {

    const antiga = document.querySelector('.toast-notification');

    if (antiga) {
        antiga.remove();
    }

    const toast = document.createElement('div');

    toast.className = `toast-notification ${tipo}`;

    let icone = 'fa-check-circle';

    if (tipo === 'erro') {
        icone = 'fa-circle-exclamation';
    }

    if (tipo === 'aviso') {
        icone = 'fa-triangle-exclamation';
    }

    toast.innerHTML = `
        <i class="fas ${icone}"></i>
        <span>${mensagem}</span>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {

        toast.classList.remove('show');

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3000);
}

/* =====================================================
   MENU MOBILE
   ===================================================== */

if (menuToggle && navLinks) {

    menuToggle.addEventListener('click', () => {

        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        const aberto = navLinks.classList.contains('active');

        menuToggle.setAttribute(
            'aria-expanded',
            aberto
        );

    });

    navLinks.querySelectorAll('a').forEach(link => {

        link.addEventListener('click', () => {

            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');

        });

    });
}

/* =====================================================
   SCROLL SUAVE
   ===================================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener('click', event => {

        const destino = link.getAttribute('href');

        if (!destino || destino === '#') {
            return;
        }

        const elemento = document.querySelector(destino);

        if (!elemento) {
            return;
        }

        event.preventDefault();

        elemento.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    });

});

/* =====================================================
   CARDÁPIO — CATEGORIAS
   ===================================================== */

tabButtons.forEach(button => {

    button.addEventListener('click', () => {

        const categoria = button.dataset.category;

        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        button.classList.add('active');

        menuCategories.forEach(category => {

            category.classList.remove('active');

            if (category.classList.contains(categoria)) {
                category.classList.add('active');
            }

        });

    });

});

/* =====================================================
   CARRINHO
   ===================================================== */

function atualizarCarrinho() {

    if (!carrinhoContainer) {
        return;
    }

    carrinhoContainer.innerHTML = '';

    if (carrinho.length === 0) {

        carrinhoContainer.innerHTML = `
            <div class="carrinho-vazio">
                <div class="carrinho-vazio-icon">
                    <i class="fas fa-basket-shopping"></i>
                </div>

                <h3>Seu carrinho está vazio</h3>

                <p>
                    Escolha seus pratos favoritos e
                    monte seu pedido.
                </p>
            </div>
        `;

        if (totalElement) {
            totalElement.textContent = 'Total: R$ 0,00';
        }

        atualizarContadorCarrinho();

        salvarCarrinho();

        return;
    }

    let total = 0;

    carrinho.forEach((item, index) => {

        const subtotal = item.preco * item.quantidade;

        total += subtotal;

        const li = document.createElement('li');

        li.className = 'item-carrinho';

        li.innerHTML = `
            <div class="item-carrinho-info">

                <div class="item-carrinho-imagem">
                    ${
                        item.imagem
                        ? `<img src="${item.imagem}" alt="${item.nome}">`
                        : `<i class="fas fa-utensils"></i>`
                    }
                </div>

                <div class="item-carrinho-dados">

                    <h4>${item.nome}</h4>

                    <span>
                        ${formatarPreco(item.preco)}
                    </span>

                </div>

            </div>

            <div class="item-carrinho-acoes">

                <div class="quantidade-controle">

                    <button
                        type="button"
                        class="btn-quantidade diminuir"
                        data-index="${index}"
                        aria-label="Diminuir quantidade"
                    >
                        <i class="fas fa-minus"></i>
                    </button>

                    <span>${item.quantidade}</span>

                    <button
                        type="button"
                        class="btn-quantidade aumentar"
                        data-index="${index}"
                        aria-label="Aumentar quantidade"
                    >
                        <i class="fas fa-plus"></i>
                    </button>

                </div>

                <strong>
                    ${formatarPreco(subtotal)}
                </strong>

                <button
                    type="button"
                    class="btn-remover"
                    data-index="${index}"
                    aria-label="Remover ${item.nome}"
                >
                    <i class="fas fa-trash"></i>
                </button>

            </div>
        `;

        carrinhoContainer.appendChild(li);

    });

    if (totalElement) {

        totalElement.innerHTML = `
            Total:
            <strong>${formatarPreco(total)}</strong>
        `;

    }

    adicionarEventosCarrinho();

    atualizarContadorCarrinho();

    salvarCarrinho();
}

/* =====================================================
   ADICIONAR AO CARRINHO
   ===================================================== */

function adicionarAoCarrinho(nome, preco, imagem = '') {

    const itemExistente = carrinho.find(
        item => item.nome === nome
    );

    if (itemExistente) {

        itemExistente.quantidade++;

    } else {

        carrinho.push({
            nome,
            preco,
            imagem,
            quantidade: 1
        });

    }

    atualizarCarrinho();

    mostrarNotificacao(
        `${nome} foi adicionado ao carrinho.`
    );

}

/* =====================================================
   ALTERAR QUANTIDADE
   ===================================================== */

function alterarQuantidade(index, quantidade) {

    if (!carrinho[index]) {
        return;
    }

    carrinho[index].quantidade = quantidade;

    if (carrinho[index].quantidade <= 0) {

        const nome = carrinho[index].nome;

        carrinho.splice(index, 1);

        mostrarNotificacao(
            `${nome} foi removido do carrinho.`,
            'aviso'
        );

    }

    atualizarCarrinho();
}

/* =====================================================
   REMOVER ITEM
   ===================================================== */

function removerItemDoCarrinho(index) {

    if (!carrinho[index]) {
        return;
    }

    const nome = carrinho[index].nome;

    carrinho.splice(index, 1);

    atualizarCarrinho();

    mostrarNotificacao(
        `${nome} foi removido do carrinho.`,
        'aviso'
    );
}

/* =====================================================
   EVENTOS DO CARRINHO
   ===================================================== */

function adicionarEventosCarrinho() {

    document
        .querySelectorAll('.btn-quantidade.aumentar')
        .forEach(button => {

            button.addEventListener('click', () => {

                const index = Number(
                    button.dataset.index
                );

                alterarQuantidade(
                    index,
                    carrinho[index].quantidade + 1
                );

            });

        });

    document
        .querySelectorAll('.btn-quantidade.diminuir')
        .forEach(button => {

            button.addEventListener('click', () => {

                const index = Number(
                    button.dataset.index
                );

                alterarQuantidade(
                    index,
                    carrinho[index].quantidade - 1
                );

            });

        });

    document
        .querySelectorAll('.btn-remover')
        .forEach(button => {

            button.addEventListener('click', () => {

                const index = Number(
                    button.dataset.index
                );

                removerItemDoCarrinho(index);

            });

        });

}

/* =====================================================
   CONTADOR DO CARRINHO
   ===================================================== */

function atualizarContadorCarrinho() {

    const quantidade = carrinho.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    const contadores = document.querySelectorAll(
        '.cart-count, #cart-count'
    );

    contadores.forEach(contador => {

        contador.textContent = quantidade;

        contador.classList.toggle(
            'visible',
            quantidade > 0
        );

    });

}

/* =====================================================
   CLIQUE NOS PRODUTOS
   ===================================================== */

menuItems.forEach(item => {

    const botaoExistente = item.querySelector(
        '.add-to-cart'
    );

    if (botaoExistente) {

        botaoExistente.addEventListener(
            'click',
            event => {

                event.stopPropagation();

                const nome = item
                    .querySelector('h3')
                    ?.textContent
                    .trim();

                const precoTexto = item
                    .querySelector('.price')
                    ?.textContent
                    .trim();

                const imagem = item
                    .querySelector('img')
                    ?.getAttribute('src') || '';

                if (!nome || !precoTexto) {
                    return;
                }

                const preco = Number(
                    precoTexto
                        .replace('R$', '')
                        .replace(/\./g, '')
                        .replace(',', '.')
                        .trim()
                );

                adicionarAoCarrinho(
                    nome,
                    preco,
                    imagem
                );

            }
        );

    } else {

        /*
         * Compatibilidade com o HTML antigo:
         * clicar no card adiciona o produto.
         */

        item.addEventListener('click', event => {

            if (
                event.target.closest(
                    'button, a, input'
                )
            ) {
                return;
            }

            const nome = item
                .querySelector('h3')
                ?.textContent
                .trim();

            const precoTexto = item
                .querySelector('.price')
                ?.textContent
                .trim();

            const imagem = item
                .querySelector('img')
                ?.getAttribute('src') || '';

            if (!nome || !precoTexto) {
                return;
            }

            const preco = Number(
                precoTexto
                    .replace('R$', '')
                    .replace(/\./g, '')
                    .replace(',', '.')
                    .trim()
            );

            adicionarAoCarrinho(
                nome,
                preco,
                imagem
            );

        });

    }

});

/* =====================================================
   FINALIZAR COMPRA
   ===================================================== */

if (finalizarCompraBtn) {

    finalizarCompraBtn.addEventListener('click', () => {

        if (carrinho.length === 0) {

            mostrarNotificacao(
                'Seu carrinho está vazio.',
                'aviso'
            );

            return;
        }

        if (pagamentoSection) {

            pagamentoSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }

    });

}

/* =====================================================
   PAGAMENTO DINÂMICO
   ===================================================== */

if (formaPagamento) {

    formaPagamento.addEventListener(
        'change',
        () => {

            const valor =
                formaPagamento.value;

            if (camposCartao) {
                camposCartao.classList.remove(
                    'active'
                );
            }

            if (camposVrVa) {
                camposVrVa.classList.remove(
                    'active'
                );
            }

            if (
                valor === 'debito' ||
                valor === 'credito'
            ) {

                if (camposCartao) {
                    camposCartao.classList.add(
                        'active'
                    );
                }

            }

            if (
                valor === 'vr' ||
                valor === 'va'
            ) {

                if (camposVrVa) {
                    camposVrVa.classList.add(
                        'active'
                    );
                }

            }

        }
    );

}

/* =====================================================
   FORMATAÇÃO DO CARTÃO
   ===================================================== */

const numeroCartao =
    document.querySelector('#numero-cartao');

if (numeroCartao) {

    numeroCartao.addEventListener(
        'input',
        () => {

            let valor =
                numeroCartao.value
                .replace(/\D/g, '')
                .substring(0, 16);

            valor = valor.replace(
                /(\d{4})(?=\d)/g,
                '$1 '
            );

            numeroCartao.value = valor;

        }
    );

}

/* =====================================================
   VALIDADE DO CARTÃO
   ===================================================== */

const validadeCartao =
    document.querySelector('#validade-cartao');

if (validadeCartao) {

    validadeCartao.addEventListener(
        'input',
        () => {

            let valor =
                validadeCartao.value
                .replace(/\D/g, '')
                .substring(0, 4);

            if (valor.length >= 3) {

                valor =
                    valor.substring(0, 2) +
                    '/' +
                    valor.substring(2);

            }

            validadeCartao.value = valor;

        }
    );

}

/* =====================================================
   CVV
   ===================================================== */

const cvvCartao =
    document.querySelector('#cvv-cartao');

if (cvvCartao) {

    cvvCartao.addEventListener(
        'input',
        () => {

            cvvCartao.value =
                cvvCartao.value
                .replace(/\D/g, '')
                .substring(0, 4);

        }
    );

}

/* =====================================================
   TELEFONE
   ===================================================== */

const telefone =
    document.querySelector('#telefone');

if (telefone) {

    telefone.addEventListener(
        'input',
        () => {

            let valor =
                telefone.value
                .replace(/\D/g, '')
                .substring(0, 11);

            if (valor.length <= 10) {

                valor = valor.replace(
                    /^(\d{2})(\d{4})(\d)/,
                    '($1) $2-$3'
                );

            } else {

                valor = valor.replace(
                    /^(\d{2})(\d{5})(\d)/,
                    '($1) $2-$3'
                );

            }

            telefone.value = valor;

        }
    );

}

/* =====================================================
   CADASTRO DO CLIENTE
   ===================================================== */

if (formCadastro) {

    formCadastro.addEventListener(
        'submit',
        event => {

            event.preventDefault();

            const nome =
                document.querySelector('#nome')
                ?.value.trim();

            const email =
                document.querySelector('#email')
                ?.value.trim();

            const telefoneValor =
                document.querySelector('#telefone')
                ?.value.trim();

            const endereco =
                document.querySelector('#endereco')
                ?.value.trim();

            if (
                !nome ||
                !email ||
                !telefoneValor ||
                !endereco
            ) {

                mostrarNotificacao(
                    'Preencha todos os campos.',
                    'erro'
                );

                return;
            }

            const cliente = {
                nome,
                email,
                telefone: telefoneValor,
                endereco
            };

            localStorage.setItem(
                'coracaoDeMaeCliente',
                JSON.stringify(cliente)
            );

            mostrarNotificacao(
                `Cadastro realizado, ${nome}!`
            );

            formCadastro.reset();

        }
    );

}

/* =====================================================
   FINALIZAR PAGAMENTO
   ===================================================== */

if (formPagamento) {

    formPagamento.addEventListener(
        'submit',
        event => {

            event.preventDefault();

            if (carrinho.length === 0) {

                mostrarNotificacao(
                    'Adicione produtos ao carrinho antes de finalizar.',
                    'aviso'
                );

                return;
            }

            if (
                formaPagamento &&
                !formaPagamento.value
            ) {

                mostrarNotificacao(
                    'Selecione uma forma de pagamento.',
                    'erro'
                );

                return;
            }

            const pedido = {
                id:
                    'CMD-' +
                    Date.now(),

                data:
                    new Date()
                    .toLocaleString('pt-BR'),

                itens:
                    [...carrinho],

                pagamento:
                    formaPagamento?.value || '',

                total:
                    carrinho.reduce(
                        (total, item) =>
                            total +
                            item.preco *
                            item.quantidade,
                        0
                    )
            };

            localStorage.setItem(
                'ultimoPedidoCoracaoDeMae',
                JSON.stringify(pedido)
            );

            mostrarNotificacao(
                'Pedido realizado com sucesso! ❤️'
            );

            setTimeout(() => {

                carrinho = [];

                atualizarCarrinho();

                formPagamento.reset();

                if (camposCartao) {
                    camposCartao.classList.remove(
                        'active'
                    );
                }

                if (camposVrVa) {
                    camposVrVa.classList.remove(
                        'active'
                    );
                }

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

            }, 1200);

        }
    );

}

/* =====================================================
   FAVORITOS
   ===================================================== */

function inicializarFavoritos() {

    menuItems.forEach(item => {

        const titulo =
            item.querySelector('h3');

        if (!titulo) {
            return;
        }

        const nome =
            titulo.textContent.trim();

        let botao =
            item.querySelector('.btn-favorito');

        if (!botao) {

            botao =
                document.createElement('button');

            botao.type = 'button';

            botao.className =
                'btn-favorito';

            botao.innerHTML =
                '<i class="far fa-heart"></i>';

            botao.setAttribute(
                'aria-label',
                'Adicionar aos favoritos'
            );

            item.style.position = 'relative';

            item.appendChild(botao);

        }

        if (favoritos.includes(nome)) {

            botao.classList.add('favorito');

            botao.innerHTML =
                '<i class="fas fa-heart"></i>';

        }

        botao.addEventListener(
            'click',
            event => {

                event.stopPropagation();

                if (
                    favoritos.includes(nome)
                ) {

                    favoritos =
                        favoritos.filter(
                            item => item !== nome
                        );

                    botao.classList.remove(
                        'favorito'
                    );

                    botao.innerHTML =
                        '<i class="far fa-heart"></i>';

                    mostrarNotificacao(
                        'Removido dos favoritos.',
                        'aviso'
                    );

                } else {

                    favoritos.push(nome);

                    botao.classList.add(
                        'favorito'
                    );

                    botao.innerHTML =
                        '<i class="fas fa-heart"></i>';

                    mostrarNotificacao(
                        'Adicionado aos favoritos.'
                    );

                }

                salvarFavoritos();

            }
        );

    });

}

inicializarFavoritos();

/* =====================================================
   REVELAÇÃO DOS ELEMENTOS AO ROLAR
   ===================================================== */

const elementosAnimados =
    document.querySelectorAll(
        '.menu-item, .about-content, .logo-container, .map-container, .footer-section'
    );

if ('IntersectionObserver' in window) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            'reveal-visible'
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

    elementosAnimados.forEach(elemento => {

        elemento.classList.add(
            'reveal-element'
        );

        observer.observe(elemento);

    });

}

/* =====================================================
   HEADER AO ROLAR
   ===================================================== */

const header =
    document.querySelector('header');

function controlarHeader() {

    if (!header) {
        return;
    }

    if (window.scrollY > 50) {

        header.classList.add(
            'header-scrolled'
        );

    } else {

        header.classList.remove(
            'header-scrolled'
        );

    }

}

window.addEventListener(
    'scroll',
    controlarHeader,
    { passive: true }
);

controlarHeader();

/* =====================================================
   BOTÃO VOLTAR AO TOPO
   ===================================================== */

let voltarTopo =
    document.querySelector(
        '#voltar-topo'
    );

if (!voltarTopo) {

    voltarTopo =
        document.createElement('button');

    voltarTopo.id =
        'voltar-topo';

    voltarTopo.className =
        'voltar-topo';

    voltarTopo.innerHTML =
        '<i class="fas fa-arrow-up"></i>';

    voltarTopo.setAttribute(
        'aria-label',
        'Voltar ao topo'
    );

    document.body.appendChild(
        voltarTopo
    );

}

window.addEventListener(
    'scroll',
    () => {

        voltarTopo.classList.toggle(
            'visible',
            window.scrollY > 500
        );

    },
    { passive: true }
);

voltarTopo.addEventListener(
    'click',
    () => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }
);

/* =====================================================
   PESQUISA DO CARDÁPIO
   ===================================================== */

const campoBusca =
    document.querySelector(
        '#busca-cardapio'
    );

if (campoBusca) {

    campoBusca.addEventListener(
        'input',
        () => {

            const termo =
                campoBusca.value
                .toLowerCase()
                .trim();

            menuItems.forEach(item => {

                const nome =
                    item.querySelector('h3')
                    ?.textContent
                    .toLowerCase() || '';

                const descricao =
                    item.querySelector('p')
                    ?.textContent
                    .toLowerCase() || '';

                const encontrado =
                    nome.includes(termo) ||
                    descricao.includes(termo);

                item.style.display =
                    encontrado
                    ? ''
                    : 'none';

            });

        }
    );

}

/* =====================================================
   TECLA ESC FECHA MENUS
   ===================================================== */

document.addEventListener(
    'keydown',
    event => {

        if (event.key === 'Escape') {

            if (menuToggle) {
                menuToggle.classList.remove(
                    'active'
                );
            }

            if (navLinks) {
                navLinks.classList.remove(
                    'active'
                );
            }

        }

    }
);

/* =====================================================
   EFEITO RIPPLE NOS BOTÕES
   ===================================================== */

document
    .querySelectorAll(
        '.btn, button'
    )
    .forEach(button => {

        button.addEventListener(
            'click',
            event => {

                const ripple =
                    document.createElement(
                        'span'
                    );

                ripple.className =
                    'ripple';

                const rect =
                    button.getBoundingClientRect();

                ripple.style.left =
                    `${event.clientX - rect.left}px`;

                ripple.style.top =
                    `${event.clientY - rect.top}px`;

                button.appendChild(
                    ripple
                );

                setTimeout(() => {
                    ripple.remove();
                }, 600);

            }
        );

    });

/* =====================================================
   ACESSIBILIDADE — IMAGENS
   ===================================================== */

document
    .querySelectorAll('img')
    .forEach(img => {

        if (!img.getAttribute('loading')) {

            img.setAttribute(
                'loading',
                'lazy'
            );

        }

    });

/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

atualizarCarrinho();

console.log(
    '❤️ Coração de Mãe — sistema inicializado com sucesso.'
);

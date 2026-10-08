document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var $ = function (s, root) { return (root || document).querySelector(s); };
    var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
    var money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    var cartKey = 'coracaoDeMaeCarrinho';
    var favoritesKey = 'coracaoDeMaeFavoritos';

    function load(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
    function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
    function price(value) { return money.format(Number(value) || 0); }
    function parsePrice(value) {
        if (typeof value === 'number') return value;
        var text = String(value || '').replace(/R\$/gi, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
        var n = Number(text);
        return Number.isFinite(n) ? n : 0;
    }
    function notify(message, type) {
        var toast = $('#toast');
        var title = $('#toastTitle');
        var text = $('#toastMessage');
        if (toast && title && text) {
            title.textContent = type === 'error' ? 'Ops!' : type === 'warning' ? 'Atenção' : 'Tudo certo!';
            text.textContent = message;
            toast.classList.add('show', 'active');
            clearTimeout(window.__cmdToastTimer);
            window.__cmdToastTimer = setTimeout(function () { toast.classList.remove('show', 'active'); }, 3000);
            return;
        }
        var old = document.querySelector('.toast-notification');
        if (old) old.remove();
        var el = document.createElement('div');
        el.className = 'toast-notification ' + (type || 'success');
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 3000);
    }

    var cart = load(cartKey, []);
    var favorites = load(favoritesKey, []);
    var header = $('#siteHeader');
    var nav = $('#navMenu');
    var menuToggle = $('#menuToggle');
    var cartTrigger = $('#cartTrigger');
    var cartOverlay = $('#cartOverlay');
    var cartDrawer = $('#cartDrawer');
    var cartClose = $('#cartClose');
    var cartItems = $('#cartItems');
    var cartEmpty = $('#cartEmpty');
    var cartTotal = $('#cartTotal');
    var checkoutButton = $('#checkoutButton');
    var checkoutModal = $('#checkoutModal');
    var checkoutClose = $('#checkoutClose');
    var checkoutForm = $('#checkoutForm');
    var checkoutTotal = $('#checkoutTotal');
    var paymentMethod = $('#formaPagamento');
    var cardFields = $('#paymentCardFields');
    var voucherFields = $('#paymentVoucherFields');

    function openCart() { if (!cartDrawer) return; cartOverlay && cartOverlay.classList.add('active'); cartDrawer.classList.add('active'); document.body.classList.add('cart-open'); }
    function closeCart() { if (!cartDrawer) return; cartOverlay && cartOverlay.classList.remove('active'); cartDrawer.classList.remove('active'); document.body.classList.remove('cart-open'); }
    function openCheckout() {
        if (!cart.length) { notify('Seu carrinho está vazio.', 'warning'); return; }
        closeCart();
        if (checkoutModal) checkoutModal.classList.add('active');
        updateCheckoutTotal();
    }
    function closeCheckout() { if (checkoutModal) checkoutModal.classList.remove('active'); }

    menuToggle && menuToggle.addEventListener('click', function () {
        var open = nav.classList.toggle('active');
        menuToggle.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    });
    $$('.nav-link', nav).forEach(function (link) { link.addEventListener('click', function () { nav.classList.remove('active'); menuToggle && menuToggle.classList.remove('active'); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { nav && nav.classList.remove('active'); closeCart(); closeCheckout(); } });
    document.addEventListener('click', function (e) { if (nav && nav.classList.contains('active') && !nav.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) { nav.classList.remove('active'); menuToggle.classList.remove('active'); } });

    $$('.nav-link[href^="#"], a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('href'); if (!id || id === '#') return;
            var target = $(id); if (!target) return;
            e.preventDefault();
            var offset = header ? header.offsetHeight : 0;
            window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset), behavior: 'smooth' });
        });
    });

    function updateHeader() { if (header) header.classList.toggle('scrolled', window.scrollY > 40); }
    window.addEventListener('scroll', updateHeader, { passive: true }); updateHeader();

    var categories = $$('.category-btn');
    var menuCategories = $$('.menu-category');
    function filterCategory(category) {
        categories.forEach(function (button) { button.classList.toggle('active', button.dataset.category === category); });
        menuCategories.forEach(function (section) {
            var active = section.dataset.category === category || section.classList.contains(category);
            section.classList.toggle('active', active); section.hidden = !active;
        });
    }
    categories.forEach(function (button) { button.addEventListener('click', function () { filterCategory(button.dataset.category); }); });
    if (categories.length) filterCategory(($('.category-btn.active') || categories[0]).dataset.category);

    function productData(card) {
        var name = (card.dataset.name || ($('h3', card) || {}).textContent || '').trim();
        var priceEl = $('.food-price', card);
        return { name: name, price: parsePrice(card.dataset.price || (priceEl ? priceEl.textContent : '0')), image: (($('img', card) || {}).getAttribute ? $('img', card).getAttribute('src') : '') || '' };
    }
    function cartCount() { return cart.reduce(function (sum, item) { return sum + (Number(item.quantity) || 0); }, 0); }
    function cartSum() { return cart.reduce(function (sum, item) { return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0); }, 0); }
    function updateCount() { var count = cartCount(); var badge = $('#cartCount'); if (badge) { badge.textContent = count > 99 ? '99+' : count; badge.classList.toggle('visible', count > 0); } }
    function addProduct(product) {
        if (!product.name || product.price <= 0) { notify('Não foi possível adicionar este produto.', 'error'); return; }
        var item = cart.find(function (x) { return x.name === product.name; });
        if (item) item.quantity += 1; else cart.push({ name: product.name, price: product.price, image: product.image, quantity: 1 });
        save(cartKey, cart); renderCart(); notify(product.name + ' foi adicionado ao pedido.');
    }
    $$('.food-card').forEach(function (card) {
        var product = productData(card);
        $$('.quick-add, .add-food', card).forEach(function (button) { button.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); addProduct(product); }); });
    });

    function renderCart() {
        updateCount();
        if (cartTotal) cartTotal.textContent = price(cartSum());
        if (checkoutTotal) checkoutTotal.textContent = price(cartSum());
        if (!cartItems) return;
        cartItems.innerHTML = '';
        if (!cart.length) { if (cartEmpty) cartEmpty.hidden = false; return; }
        if (cartEmpty) cartEmpty.hidden = true;
        cart.forEach(function (item, index) {
            var row = document.createElement('div'); row.className = 'cart-item';
            row.innerHTML = '<div class="cart-item-info"><strong>' + escapeHTML(item.name) + '</strong><span>' + price(item.price) + '</span></div>' +
                '<div class="cart-item-actions"><button type="button" data-action="minus" data-index="' + index + '">−</button><span>' + item.quantity + '</span><button type="button" data-action="plus" data-index="' + index + '">+</button><button type="button" data-action="remove" data-index="' + index + '" aria-label="Remover">×</button></div>';
            cartItems.appendChild(row);
        });
    }
    function escapeHTML(value) { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
    cartItems && cartItems.addEventListener('click', function (e) {
        var button = e.target.closest('button[data-index]'); if (!button) return;
        var index = Number(button.dataset.index); if (!cart[index]) return;
        if (button.dataset.action === 'plus') cart[index].quantity += 1;
        if (button.dataset.action === 'minus') cart[index].quantity -= 1;
        if (button.dataset.action === 'remove' || cart[index].quantity <= 0) cart.splice(index, 1);
        save(cartKey, cart); renderCart();
    });

    cartTrigger && cartTrigger.addEventListener('click', openCart);
    cartClose && cartClose.addEventListener('click', closeCart);
    cartOverlay && cartOverlay.addEventListener('click', closeCart);
    checkoutButton && checkoutButton.addEventListener('click', openCheckout);
    checkoutClose && checkoutClose.addEventListener('click', closeCheckout);

    function updatePaymentFields() {
        var value = paymentMethod ? paymentMethod.value : '';
        if (cardFields) cardFields.hidden = !(value === 'credito' || value === 'debito');
        if (voucherFields) voucherFields.hidden = !(value === 'vr' || value === 'va');
    }
    paymentMethod && paymentMethod.addEventListener('change', updatePaymentFields); updatePaymentFields();

    function digits(value, max) { return value.replace(/\D/g, '').slice(0, max); }
    var cardNumber = $('#numeroCartao'), cardName = $('#nomeCartao'), expiry = $('#validadeCartao'), cvv = $('#cvvCartao'), voucher = $('#codigoVale');
    cardNumber && cardNumber.addEventListener('input', function () { cardNumber.value = digits(cardNumber.value, 16).replace(/(\d{4})(?=\d)/g, '$1 '); });
    expiry && expiry.addEventListener('input', function () { var v = digits(expiry.value, 4); expiry.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v; });
    cvv && cvv.addEventListener('input', function () { cvv.value = digits(cvv.value, 4); });

    checkoutForm && checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!cart.length) { notify('Seu carrinho está vazio.', 'warning'); return; }
        if (!paymentMethod || !paymentMethod.value) { notify('Selecione uma forma de pagamento.', 'error'); return; }
        var order = { id: 'CMD-' + Date.now(), items: cart.map(function (x) { return { name: x.name, price: x.price, quantity: x.quantity }; }), paymentMethod: paymentMethod.value, total: cartSum(), createdAt: new Date().toISOString() };
        save('ultimoPedidoCoracaoDeMae', order);
        notify('Pedido realizado com sucesso! ❤️');
        cart = []; save(cartKey, cart); renderCart(); checkoutForm.reset(); updatePaymentFields();
        setTimeout(closeCheckout, 900);
    });

    var customerFields = { name: $('#clienteNome'), phone: $('#clienteTelefone'), email: $('#clienteEmail'), address: $('#clienteEndereco'), neighborhood: $('#clienteBairro'), cep: $('#clienteCep') };
    var customerForm = $('#checkoutForm');
    var customerPhone = customerFields.phone;
    customerPhone && customerPhone.addEventListener('input', function () { var v = digits(customerPhone.value, 11); customerPhone.value = v.length > 10 ? v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3') : v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3'); });

    $$('.btn-favorito').forEach(function (button) {
        var card = button.closest('.food-card'); if (!card) return; var name = productData(card).name;
        function sync() { var active = favorites.indexOf(name) !== -1; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); }
        sync(); button.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); var i = favorites.indexOf(name); if (i >= 0) favorites.splice(i, 1); else favorites.push(name); save(favoritesKey, favorites); sync(); });
    });

    var search = $('#menuSearch') || $('#buscaCardapio');
    search && search.addEventListener('input', function () { var term = search.value.toLowerCase().trim(); $$('.food-card').forEach(function (card) { var text = card.textContent.toLowerCase(); card.hidden = term && text.indexOf(term) === -1; }); });

    var loader = $('#pageLoader');
    window.addEventListener('load', function () { if (loader) { loader.classList.add('hidden'); setTimeout(function () { loader.remove(); }, 500); } });
    $$('img').forEach(function (img) { if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy'); });
    renderCart();
    console.log('❤️ Coração de Mãe — sistema inicializado.');
});
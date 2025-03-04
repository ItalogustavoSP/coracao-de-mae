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
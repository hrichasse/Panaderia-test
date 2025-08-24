// JavaScript code for the Pastelería Mil Sabores web application

// Product data
const products = [
    // Tortas Cuadradas
    { id: 1, name: "Torta Cuadrada de Chocolate", price: 45000, category: "tortas-cuadradas", description: "Deliciosa torta de chocolate con cobertura de ganache", image: "https://placehold.co/300x200" },
    { id: 2, name: "Torta Cuadrada de Frutas", price: 50000, category: "tortas-cuadradas", description: "Torta fresca con frutas de estación", image: "https://placehold.co/300x200" },
    
    // Tortas Circulares
    { id: 3, name: "Torta Circular de Vainilla", price: 40000, category: "tortas-circulares", description: "Clásica torta de vainilla con crema batida", image: "https://placehold.co/300x200" },
    { id: 4, name: "Torta Circular de Manjar", price: 42000, category: "tortas-circulares", description: "Torta con delicioso manjar casero", image: "https://placehold.co/300x200" },
    
    // Postres Individuales
    { id: 5, name: "Mousse de Chocolate", price: 5000, category: "postres-individuales", description: "Cremoso mousse de chocolate belga", image: "https://placehold.co/300x200" },
    { id: 6, name: "Tiramisú Clásico", price: 5500, category: "postres-individuales", description: "Auténtico tiramisú italiano", image: "https://placehold.co/300x200" },
    
    // Sin Azúcar
    { id: 7, name: "Torta Sin Azúcar de Naranja", price: 48000, category: "sin-azucar", description: "Torta endulzada naturalmente con stevia", image: "https://placehold.co/300x200" },
    { id: 8, name: "Cheesecake Sin Azúcar", price: 47000, category: "sin-azucar", description: "Cremoso cheesecake sin azúcar añadida", image: "https://placehold.co/300x200" },
    
    // Tradicional
    { id: 9, name: "Empanada de Manzana", price: 3000, category: "tradicional", description: "Tradicional empanada chilena de manzana", image: "https://placehold.co/300x200" },
    { id: 10, name: "Tarta de Santiago", price: 6000, category: "tradicional", description: "Clásica tarta española de almendras", image: "https://placehold.co/300x200" },
    
    // Sin Gluten
    { id: 11, name: "Brownie Sin Gluten", price: 4000, category: "sin-gluten", description: "Brownie chocolate sin gluten", image: "https://placehold.co/300x200" },
    { id: 12, name: "Pan Sin Gluten", price: 3500, category: "sin-gluten", description: "Pan artesanal libre de gluten", image: "https://placehold.co/300x200" },
    
    // Vegana
    { id: 13, name: "Torta Vegana de Chocolate", price: 50000, category: "vegana", description: "Torta 100% vegetal de chocolate", image: "https://placehold.co/300x200" },
    { id: 14, name: "Galletas Veganas de Avena", price: 4500, category: "vegana", description: "Galletas veganas con avena y pasas", image: "https://placehold.co/300x200" },
    
    // Especiales
    { id: 15, name: "Torta Especial de Cumpleaños", price: 55000, category: "especiales", description: "Torta personalizada para cumpleaños", image: "https://placehold.co/300x200" },
    { id: 16, name: "Torta Especial de Boda", price: 60000, category: "especiales", description: "Elegante torta para bodas", image: "https://placehold.co/300x200" }
];

// Cart functionality
let cart = [];
let currentFilter = 'todos';
let discountApplied = false;
let discountPercentage = 0;
let userAge = 0;

// includeSections + lógica de la app en un solo archivo

async function includeSections() {
    const includes = document.querySelectorAll('[data-include]');
    for (const el of includes) {
        const path = el.getAttribute('data-include');
        try {
            const res = await fetch(path);
            if (!res.ok) throw new Error(res.statusText);
            el.innerHTML = await res.text();
        } catch (err) {
            el.innerHTML = `<div style="padding:1rem;color:#900">No se pudo cargar ${path}: ${err.message}</div>`;
        }
    }
}

// Función que inicializa la app (antes estaba en DOMContentLoaded)
function initApp() {
    // ...aquí va todo el código que inicializa la UI, displayProducts(), listeners, etc...
    // por ejemplo:
    displayProducts(products);
    updateCartDisplay();
    // ...resto de listeners...
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    if (location.protocol === 'file:') {
        console.error('Abre el proyecto desde un servidor (no file://).');
        // Opcional: show mensaje en pantalla
    }
    await includeSections();
    initApp();
});

// Display products
function displayProducts(productsToShow) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card fade-in';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toLocaleString()}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Agregar al Carrito</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Filter products
function filterProducts(category) {
    currentFilter = category;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter and display products
    let filteredProducts = category === 'todos' ? products : products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
    showToast('Producto agregado al carrito', 'success');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showToast('Producto eliminado del carrito', 'success');
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Tu carrito está vacío</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toLocaleString()}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update total
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Apply discount if applicable
    if (discountApplied) {
        total = total * (1 - discountPercentage / 100);
    }

    cartTotal.textContent = total.toLocaleString();
}

// Toggle cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

// Apply discount
function applyDiscount() {
    const discountCode = document.getElementById('discountCode').value.toUpperCase();
    
    if (discountCode === 'FELICES50') {
        discountApplied = true;
        discountPercentage = 10;
        updateCartDisplay();
        showToast('Descuento del 10% aplicado!', 'success');
    } else {
        showToast('Código de descuento inválido', 'error');
    }
}

// Check age discount
function checkAgeDiscount(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    if (age >= 50) {
        discountApplied = true;
        discountPercentage = 50;
        updateCartDisplay();
        showToast('Descuento del 50% por edad aplicado!', 'success');
    }

    return age;
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío', 'error');
        return;
    }

    // Simulate checkout process
    const total = document.getElementById('cartTotal').textContent;
    showToast(`Pedido procesado por $${total} CLP. ¡Gracias por tu compra!`, 'success');
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    toggleCart();
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Login form handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const birthDate = document.getElementById('birthDate').value;

    if (birthDate) {
        userAge = checkAgeDiscount(birthDate);
    }

    // Check if it's a Duoc student email
    if (email.includes('@duocuc.cl')) {
        showToast('¡Estudiante de Duoc detectado! Torta gratis en tu cumpleaños.', 'success');
    }

    closeModal('loginModal');
    showToast('Sesión iniciada correctamente', 'success');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                block: 'start'
            });
        }
    });
});

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
});

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.product-card, .category-card');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);

// Add login button to navigation (for demonstration)
const navLinks = document.querySelector('.nav-links');
const loginButton = document.createElement('li');
loginButton.innerHTML = '<a href="#" onclick="openModal(\'loginModal\')">Iniciar Sesión</a>';
navLinks.insertBefore(loginButton, navLinks.lastElementChild);
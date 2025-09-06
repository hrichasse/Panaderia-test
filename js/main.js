//tortas ricas
const products = [
    // Tortas Cuadradas
    { id: 1, name: "Torta Cuadrada de Chocolate", price: 45000, category: "tortas-cuadradas", description: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.", image: "images/torta-chocolate.jpg" },
    { id: 2, name: "Torta Cuadrada de Frutas", price: 50000, category: "tortas-cuadradas", description: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.", image: "images/torta-frutas.jpg" },
    
    // Tortas Circulares
    { id: 3, name: "Torta Circular de Vainilla", price: 40000, category: "tortas-circulares", description: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.", image: "images/torta-vainilla.jpg" },
    { id: 4, name: "Torta Circular de Manjar", price: 42000, category: "tortas-circulares", description: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.", image: "images/torta-manjar.jpg" },
    
    // Postres Individuales
    { id: 5, name: "Mousse de Chocolate", price: 5000, category: "postres-individuales", description: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.", image: "images/mousse-chocolate.jpg" },
    { id: 6, name: "Tiramisú Clásico", price: 5500, category: "postres-individuales", description: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.", image: "images/tiramisu.jpg" },
    
    // Sin Azúcar
    { id: 7, name: "Torta Sin Azúcar de Naranja", price: 48000, category: "sin-azucar", description: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.", image: "images/torta-naranja-sin-azucar.jpg" },
    { id: 8, name: "Cheesecake Sin Azúcar", price: 47000, category: "sin-azucar", description: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.", image: "images/cheesecake-sin-azucar.jpg" },
    
    // Tradicional
    { id: 9, name: "Empanada de Manzana", price: 3000, category: "tradicional", description: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.", image: "images/empanada-manzana.jpg" },
    { id: 10, name: "Tarta de Santiago", price: 6000, category: "tradicional", description: "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.", image: "images/tarta-santiago.jpg" },
    
    // Sin Gluten
    { id: 11, name: "Brownie Sin Gluten", price: 4000, category: "sin-gluten", description: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.", image: "images/brownie-sin-gluten.jpg" },
    { id: 12, name: "Pan Sin Gluten", price: 3500, category: "sin-gluten", description: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.", image: "images/pan-sin-gluten.jpg" },
    
    // Vegana
    { id: 13, name: "Torta Vegana de Chocolate", price: 50000, category: "vegana", description: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.", image: "images/torta-vegana-chocolate.jpg" },
    { id: 14, name: "Galletas Veganas de Avena", price: 4500, category: "vegana", description: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.", image: "images/galletas-veganas-avena.jpg" },
    
    // Especiales
    { id: 15, name: "Torta Especial de Cumpleaños", price: 55000, category: "especiales", description: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.", image: "images/torta-cumpleanos.jpg" },
    { id: 16, name: "Torta Especial de Boda", price: 60000, category: "especiales", description: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.", image: "images/torta-boda.jpg" }
];

// funcionalidad del carro
let cart = [];
let currentFilter = 'todos';
let discountApplied = false;
let discountPercentage = 0;
let userAge = 0;

// Variables para la carga de productos
let productsPerPage = 8; // Cuántos productos mostrar inicialmente y por cada "Cargar Más"
let currentProductIndex = 0;
let currentFilteredProducts = []; // Para mantener los productos filtrados actuales
let showingAll = false; // saber si estás mostrando todo o solo 8


// Función para incluir secciones HTML dinámicamente
async function includeSections() {
    const includes = document.querySelectorAll('[data-include]');
    for (const el of includes) {
        const path = el.getAttribute('data-include');
        try {
            const res = await fetch(path);
            if (!res.ok) throw new Error(res.statusText);
            el.innerHTML = await res.text();
        } catch (err) {
            console.error(`Error al cargar ${path}: ${err.message}`);
            el.innerHTML = `<div style="padding:1rem;color:#900">No se pudo cargar ${path}: ${err.message}</div>`;
        }
    }
}

// Función que inicializa la app después de que las secciones se han cargado
function initApp() {
    // Inicializa los productos a mostrar
    currentFilteredProducts = [...products]; // Copia todos los productos inicialmente
    currentProductIndex = 0;
    renderProducts(); // Carga los primeros productos

    // Asegurar que el comportamiento del carrito se configure siempre (delegación + listeners)
    try {
        setupCartBehavior && setupCartBehavior();
    } catch (err) {
        console.error('initApp: error al ejecutar setupCartBehavior', err);
    }

    updateCartDisplay();
    setupEventListeners(); // Centraliza todos los event listeners
    setupFaqToggle(); // Configura el acordeón de FAQ
    animateOnScroll(); // Llama una vez al cargar para los elementos visibles inicialmente

    // Debug: informar si existen los elementos esperados
    console.debug('initApp: cart icon existe?', !!document.querySelector('.cart-icon'));
    console.debug('initApp: cart sidebar existe?', !!getCartSidebar());
}

// Initialize the page - DOMContentLoaded ahora solo llama a includeSections y luego a initApp
document.addEventListener('DOMContentLoaded', async () => {
    if (location.protocol === 'file:') {
        console.warn('Estás abriendo el proyecto directamente desde un archivo (file://). Algunas funcionalidades (como la carga de secciones) pueden no funcionar debido a restricciones de seguridad del navegador (CORS). Por favor, usa un servidor local (ej. Live Server de VS Code).');
    }
    await includeSections(); // Espera a que todas las secciones se carguen
    initApp(); // Luego inicializa la aplicación
});

// Inicializar acordeón FAQ (llamar después de incluir secciones / en initApp)
function initFAQ() {
  // mejora accesibilidad para summaries
  document.querySelectorAll('.faq summary').forEach(summary => {
    summary.setAttribute('role', 'button');
    summary.setAttribute('tabindex', '0');

    // keyboard (Enter / Space)
    summary.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        summary.click();
      }
    });
  });

  // Capturing handler: ejecuta el toggle antes que handlers globales y evita que los detengan
  document.addEventListener('click', function captureFAQClick(e) {
    const s = e.target.closest && e.target.closest('.faq summary');
    if (!s) return;
    // prevenir que otros handlers bloqueen el comportamiento nativo
    try {
      const details = s.closest('details');
      if (!details) return;
      // Toggle manual para garantizar apertura/cierre
      details.open = !details.open;
      // impedir propagación adicional que pueda cancelar la acción
      e.stopImmediatePropagation();
      e.preventDefault && e.preventDefault();
    } catch (err) {
      console.error('initFAQ capture handler error', err);
    }
  }, true); // use capture phase so runs before bubble handlers
}

// Asegura llamada segura tras carga de secciones (include.js inyecta main.js después)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initFAQ, 50);
  });
} else {
  setTimeout(initFAQ, 50);
}

// Centraliza los event listeners
function setupEventListeners() {
    // Toggle cart (buscar icono, no asumir que existe un id exacto para el sidebar)
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            // prevenir comportamiento por defecto (en caso de <a href="#">)
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            // no stopPropagation para no bloquear otros handlers globales
            const cs = getCartSidebar();
            if (!cs) {
                console.warn('click cart-icon: sidebar no encontrado');
                return;
            }
            toggleCart();
        });
    }

    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function(e) {
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            toggleCart(false);
        });
    }

    // Apply discount
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    if (applyDiscountBtn) {
        applyDiscountBtn.addEventListener('click', applyDiscount);
    }

    // Checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
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
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth', // Desplazamiento suave
                    block: 'start'
                });
            }
        });
    });

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        const cartSidebar = getCartSidebar();
        const cartIconEl = document.querySelector('.cart-icon');
        
        if (!cartSidebar) return;
        // Si el sidebar está abierto y el clic NO fue dentro del sidebar ni sobre el icono, cerrarlo
        if (cartSidebar.classList.contains('open') && !cartSidebar.contains(e.target) && !(cartIconEl && cartIconEl.contains(e.target))) {
            toggleCart(false);
        }
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            // Solo cierra si el clic fue directamente en el fondo del modal
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Animate elements on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Add login button to navigation (for demonstration)
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) { // Asegúrate de que navLinks exista
        const loginButton = document.createElement('li');
        loginButton.innerHTML = '<a href="#" onclick="openModal(\'loginModal\')">Iniciar Sesión</a>';
        navLinks.insertBefore(loginButton, navLinks.lastElementChild);
    }

    // Listener para el botón "Cargar Más"
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', toggleShowAll);
    }

    // Filter buttons (delegación de eventos para asegurar que funcionen después de la carga)
    const filterButtonsContainer = document.querySelector('.filter-buttons');
    if (filterButtonsContainer) {
        filterButtonsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('filter-btn')) {
                filterProducts(e.target.dataset.category);
            }
        });
    }
}


// Display products
function displayProducts(productsToRender, append = false) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return; // Asegúrate de que el elemento exista

    if (!append) {
        productGrid.innerHTML = ''; // Limpiar si no es para añadir
    }

    productsToRender.forEach(product => {
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

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = "";

  // 👉 cuando showingAll = true, usa SIEMPRE "products" (los 16)
  const list = showingAll
    ? products
    : currentFilteredProducts.slice(0, productsPerPage);

  displayProducts(list);

  const btn = document.getElementById("loadMoreBtn");
  if (btn) {
    btn.classList.remove("hidden");
    btn.textContent = showingAll ? "Mostrar menos" : "Ver todos los productos";
    // 👉 que el botón se muestre si hay más de 8 en TOTAL (no por categoría)
    btn.style.display = products.length <= productsPerPage ? "none" : "block";
  }
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('#loadMoreBtn');
  if (!btn) return;
  e.preventDefault();
  toggleShowAll();
});



function toggleShowAll() {
  // Si vamos a expandir, forzamos a ver TODAS las categorías
  if (!showingAll) {
    currentFilter = 'todos';
    currentFilteredProducts = products;

    // Marcar visualmente el filtro "Todos"
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === 'todos');
    });
  }

  // Alternar estado y volver a pintar
  showingAll = !showingAll;
  renderProducts();

  // Si colapsamos, subir a la grilla para ver el inicio
  if (!showingAll) {
    const grid = document.getElementById('productGrid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
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

    // Filter products and reset index
    currentFilteredProducts = category === 'todos' ? products : products.filter(product => product.category === category);
    currentProductIndex = 0; // Reiniciar el índice al filtrar
    
    // Display the first batch of filtered products
    showingAll = false;    //  vuelve a 8
    renderProducts();     //  renderiza según estado

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

    if (!cartItems || !cartCount || !cartTotal) return; // Asegúrate de que los elementos existan

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #8B4513; margin-top: 2rem;">Tu carrito está vacío</p>';
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

// Función helper: buscar el sidebar con varios selectores comunes
function getCartSidebar() {
    const sel = [
        '#cartSidebar',
        '#cart-sidebar',
        '.cart-sidebar',
        '.cartSidebar',
        '[data-cart-sidebar]'
    ];
    for (const s of sel) {
        const found = document.querySelector(s);
        if (found) {
            // log para depuración
            console.debug(`getCartSidebar: encontrado con selector "${s}"`);
            return found;
        }
    }
    console.debug('getCartSidebar: no se encontró sidebar con selectores esperados');
    return null;
}

// Toggle cart robusto y accesible (con logging)
function toggleCart(forceOpen) {
    const cartSidebar = getCartSidebar();
    if (!cartSidebar) {
        console.error('toggleCart: sidebar no encontrado. Asegúrate que el HTML incluya el template de cart con algún selector compatible.');
        return;
    }
    const isOpen = cartSidebar.classList.contains('open');
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !isOpen;
    cartSidebar.classList.toggle('open', shouldOpen);
    cartSidebar.setAttribute('aria-hidden', String(!shouldOpen));
    console.debug(`toggleCart: sidebar ${shouldOpen ? 'abierto' : 'cerrado'}`);
}

// Asegura que funciones usadas por handlers inline existan globalmente
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.applyDiscount = applyDiscount;
window.checkout = checkout;
window.openModal = openModal;
window.closeModal = closeModal;

// Asegura que los listeners del icono y botón funcionen incluso si se agregan dinámicamente
function setupCartBehavior() {
    // Delegación para el icono de carrito (funciona aunque se agregue después)
    document.addEventListener('click', (e) => {
        const icon = e.target.closest && e.target.closest('.cart-icon');
        if (icon) {
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            const cs = getCartSidebar();
            if (!cs) {
                console.warn('delegated cart-icon click: sidebar no encontrado');
                return;
            }
            toggleCart();
        }
    });

    // Botón cerrar en sidebar (delegado)
    document.addEventListener('click', (e) => {
        const close = e.target.closest && e.target.closest('.close-cart');
        if (close) {
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            toggleCart(false);
        }
    });

    // Sincroniza visual del carrito
    updateCartDisplay();
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
    discountApplied = false; // Reset discount
    discountPercentage = 0;
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
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex'; // Usar flex para centrar
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.product-card, .category-card, .about-text, .about-image, .testimonial-card, .faq-item'); // Añade más elementos
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150; // Ajusta este valor según sea necesario
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        } else {
            // Opcional: remover la clase si sale de la vista para re-animar al volver a entrar
            // element.classList.remove('fade-in');
        }
    });
}

// Setup FAQ toggle functionality
function setupFaqToggle() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            question.classList.toggle('active');
            if (answer.classList.contains('show')) {
                answer.classList.remove('show');
            } else {
                answer.classList.add('show');
            }
        });
    });
}

// Al final del archivo: exponer y sincronizar
window.cart = window.cart || [];
window.addToCart = addToCart || function(id){
  const p = (window.products || products || []).find(x=>x.id===id); if(!p) return;
  const ex = window.cart.find(i=>i.id===id);
  if(ex) ex.quantity++; else window.cart.push({...p, quantity:1});
  if(typeof updateCartDisplay==='function') updateCartDisplay();
  if(typeof toggleCart==='function') toggleCart(true);
};
window.toggleCart = window.toggleCart || function(force){
  const cs = document.getElementById('cartSidebar') || document.querySelector('.cart-sidebar');
  if(!cs) return console.warn('toggleCart: sidebar no encontrado');
  const open = typeof force==='boolean' ? force : !cs.classList.contains('open');
  cs.classList.toggle('open', open);
  cs.setAttribute('aria-hidden', String(!open));
};
window.updateCartDisplay = window.updateCartDisplay || function(){
  const el = document.getElementById('cartItems'); if(!el) return;
  if(window.cart.length===0) el.innerHTML='<p>Tu carrito está vacío</p>';
  else el.innerHTML = window.cart.map(i=>`<div>${i.name} x${i.quantity}</div>`).join('');
  const ct = document.getElementById('cartTotal'); if(ct) ct.textContent = window.cart.reduce((s,i)=>s+i.price*i.quantity,0).toLocaleString();
};

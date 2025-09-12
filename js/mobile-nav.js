document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('nav');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!nav || !toggle || !navLinks) return;

  toggle.addEventListener('click', function (e) {
    e.stopPropagation(); // evitar que el document click lo cierre inmediatamente
    const isOpen = nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cerrar menú al redimensionar a escritorio
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && nav.classList.contains('nav-open')) {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Cerrar al tocar fuera del nav (no cierra si haces click dentro)
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && nav.classList.contains('nav-open')) {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Evitar que clics en los links cierren inmediatamente si quieres que el usuario vea el efecto:
  navLinks.addEventListener('click', function (e) {
    // si quieres que al tocar un enlace se cierre el menú, descomenta:
    // nav.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false');
  });
});
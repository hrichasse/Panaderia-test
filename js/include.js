async function includeSections() {
    const includes = document.querySelectorAll('[data-include]');
    console.group('include.js');
    for (const el of includes) {
        const path = el.getAttribute('data-include');
        console.log('Cargando:', path);
        try {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
            el.innerHTML = await res.text();
            console.log('Cargado OK:', path);
        } catch (err) {
            console.error('Fallo al cargar', path, err);
            el.innerHTML = `<div style="padding:1rem;background:#fee;color:#900">No se pudo cargar <strong>${path}</strong>: ${err.message}</div>`;
        }
    }
    console.groupEnd();

    // Inyectar main.js solo después de incluir secciones
    const s = document.createElement('script');
    s.src = 'js/main.js';
    s.defer = true;
    s.onload = () => console.log('main.js cargado');
    s.onerror = () => console.error('Error cargando main.js');
    document.body.appendChild(s);
}
document.addEventListener('DOMContentLoaded', includeSections);
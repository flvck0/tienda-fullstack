import React from 'react';
import { createRoot } from 'react-dom/client';

// Ajusta las rutas según tu estructura
import HomePage from './pages/HomePage.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Mock de fetch para que no golpee al backend en los tests
beforeEach(() => {
  spyOn(window, 'fetch').and.resolveTo(
    new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  );

  // Evita que el CartProvider dispare alerts en el test
  if (!window.alert) window.alert = () => {};
  spyOn(window, 'alert').and.callFake(() => {});
});

describe('HomePage (smoke)', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    if (root) root.unmount();
    if (container && container.parentNode) container.parentNode.removeChild(container);
  });

  it('renderiza sin explotar y muestra el título de productos', async () => {
    // ← Envolvemos con el provider que requiere HomePage
    root.render(
      <CartProvider>
        <HomePage />
      </CartProvider>
    );

    // da tiempo a useEffect/setState
    await new Promise(r => setTimeout(r, 10));

    // Busca el título por varios caminos (id/clase/h1-h3 con texto)
    const heading =
      document.querySelector('#productos-titulo') ||
      document.querySelector('.section-title') ||
      [...document.querySelectorAll('h1,h2,h3')].find(h =>
        /copetes|destacados|productos/i.test(h.textContent)
      );

    // Si falla, imprime HTML para debug
    expect(heading).withContext(document.body.innerHTML).not.toBeNull();

    if (heading) {
      expect(heading.textContent.toLowerCase()).toMatch(/copetes|destacados|productos/);
    }
  });
});

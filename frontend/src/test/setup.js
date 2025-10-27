// frontend/src/test/setup.js
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

// Render compatible con React 18 (fallback a 17)
window.renderIntoDocument = (element) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  if (ReactDOMClient && typeof ReactDOMClient.createRoot === 'function') {
    const root = ReactDOMClient.createRoot(container);
    root.render(element);
    return { container, unmount: () => root.unmount() };
  } else {
    ReactDOM.render(element, container);
    return { container, unmount: () => ReactDOM.unmountComponentAtNode(container) };
  }
};

// Envolver cualquier nodo en un Router de pruebas
window.wrapInRouter = (node, initialPath = '/') => (
  <MemoryRouter initialEntries={[initialPath]}>
    {node}
  </MemoryRouter>
);

// Mocks simples
if (!window.fetch) {
  window.fetch = () => Promise.resolve({ ok: true, json: async () => ({ ok: true }) });
}
if (!window.alert) {
  window.alert = () => {};
}

// Helper seguro para inputs (no crashea si no encuentra el input)
window.typeInInput = (inputEl, value) => {
  if (!inputEl) return; // tolerante
  inputEl.value = value;
  inputEl.dispatchEvent(new Event('input', { bubbles: true }));
};

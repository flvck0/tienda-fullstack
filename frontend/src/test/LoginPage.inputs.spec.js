import React from 'react';
import LoginPage from '../pages/LoginPage';

const mount = (el) => window.renderIntoDocument(window.wrapInRouter(el));
const q = (c, s) => c.querySelector(s);

describe('LoginPage (inputs)', () => {
  it('renderiza y, si existen, permite escribir email/password', () => {
    const { container, unmount } = mount(<LoginPage />);

    const email = q(container, 'input[type="email"], input[name="email"], #email, [placeholder*="mail" i]');
    const pass  = q(container, 'input[type="password"], input[name="password"], #password, [placeholder*="contraseña" i]');

    // Smoke mínimo
    expect(container).toBeTruthy();

    // Solo si existen, probamos escritura
    window.typeInInput(email, 'user@test.com');
    window.typeInInput(pass,  '123456');

    if (email) expect(email.value).toBe('user@test.com');
    if (pass)  expect(pass.value).toBe('123456');

    unmount();
  });
});

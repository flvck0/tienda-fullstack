import React from 'react';
import RegisterPage from '../pages/RegisterPage';

const mount = (el) => window.renderIntoDocument(window.wrapInRouter(el));
const q = (c, s) => c.querySelector(s);

describe('RegisterPage (inputs)', () => {
  it('renderiza y, si existen, permite escribir campos básicos', () => {
    const { container, unmount } = mount(<RegisterPage />);
    expect(container).toBeTruthy();

    const name    = q(container, 'input[name="name"], #name, [placeholder*="nombre" i]');
    const email   = q(container, 'input[type="email"], input[name="email"], #email');
    const pass    = q(container, 'input[name="password"], #password, input[type="password"]');
    const confirm = q(container, 'input[name="confirm"], #confirm, [name*="confirm" i]');

    window.typeInInput(name,    'Basti');
    window.typeInInput(email,   'basti@test.com');
    window.typeInInput(pass,    'abc123');
    window.typeInInput(confirm, 'abc123');

    if (name)    expect(name.value).toBe('Basti');
    if (email)   expect(email.value).toBe('basti@test.com');
    if (pass)    expect(pass.value).toBe('abc123');
    if (confirm) expect(confirm.value).toBe('abc123');

    unmount();
  });
});

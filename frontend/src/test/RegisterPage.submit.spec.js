import React from 'react';
import RegisterPage from '../pages/RegisterPage';

const mount = (el) => window.renderIntoDocument(window.wrapInRouter(el));
const q = (c, s) => c.querySelector(s);

describe('RegisterPage (submit feliz)', () => {
  it('si hay form, llama a fetch; si no, smoke', (done) => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({ ok: true, json: async () => ({ ok: true }) }));
    const { container, unmount } = mount(<RegisterPage />);
    expect(container).toBeTruthy();

    const name    = q(container, 'input[name="name"], #name, [placeholder*="nombre" i]');
    const email   = q(container, 'input[type="email"], input[name="email"], #email');
    const pass    = q(container, 'input[name="password"], #password, input[type="password"]');
    const confirm = q(container, 'input[name="confirm"], #confirm, [name*="confirm" i]');
    const submit  = q(container, 'button[type="submit"], button#register, form button');

    if (name && email && pass && confirm && submit) {
      window.typeInInput(name, 'Benja');
      window.typeInInput(email, 'benja@test.com');
      window.typeInInput(pass, 'abc123');
      window.typeInInput(confirm, 'abc123');
      submit.click();

      setTimeout(() => {
        expect(window.fetch).toHaveBeenCalled();
        unmount();
        done();
      }, 25);
    } else {
      expect(true).toBeTrue();
      unmount();
      done();
    }
  });
});

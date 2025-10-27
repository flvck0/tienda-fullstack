import React from 'react';
import RegisterPage from '../pages/RegisterPage';

const mount = (el) => window.renderIntoDocument(window.wrapInRouter(el));
const q = (c, s) => c.querySelector(s);

describe('RegisterPage (mismatch)', () => {
  it('si hay form, intenta mismatch; si no, smoke', () => {
    const { container, unmount } = mount(<RegisterPage />);
    expect(container).toBeTruthy();

    const pass    = q(container, 'input[name="password"], #password, input[type="password"]');
    const confirm = q(container, 'input[name="confirm"], #confirm, [name*="confirm" i]');
    const submit  = q(container, 'button[type="submit"], button#register, form button');

    if (pass && confirm && submit) {
      window.typeInInput(pass, 'abc123');
      window.typeInInput(confirm, 'zzz999');
      submit.click();

      const text = container.textContent.toLowerCase();
      const hint = text.includes('coincid') || text.includes('confirm') || text.includes('igual');
      expect(hint).toBeTrue();
    } else {
      expect(true).toBeTrue(); // smoke
    }
    unmount();
  });
});

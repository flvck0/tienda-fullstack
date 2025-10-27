import React from 'react';
import LoginPage from '../pages/LoginPage';
import { CartProvider } from '../context/CartContext';

describe('LoginPage', () => {
  it('renderiza', () => {
    const { container, unmount } = window.renderIntoDocument(
      <CartProvider><LoginPage /></CartProvider>
    );
    expect(container).toBeTruthy();
    unmount();
  });
});

import React from 'react';
import RegisterPage from '../pages/RegisterPage';
import { CartProvider } from '../context/CartContext';

describe('RegisterPage', () => {
  it('renderiza', () => {
    const { container, unmount } = window.renderIntoDocument(
      <CartProvider><RegisterPage /></CartProvider>
    );
    expect(container).toBeTruthy();
    unmount();
  });
});

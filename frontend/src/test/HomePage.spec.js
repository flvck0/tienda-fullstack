import React from 'react';
import HomePage from '../pages/HomePage';
import { CartProvider } from '../context/CartContext';

describe('HomePage', () => {
  it('renderiza sin crashear', () => {
    const { container, unmount } = window.renderIntoDocument(
      <CartProvider><HomePage /></CartProvider>
    );
    expect(container).toBeTruthy();
    unmount();
  });
});

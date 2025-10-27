import React from 'react';
import HomePage from '../pages/HomePage';

const mount = (el) => window.renderIntoDocument(window.wrapInRouter(el));

describe('HomePage (nav/smoke)', () => {
  it('renderiza dentro de un Router', () => {
    const { container, unmount } = mount(<HomePage />);
    expect(container).toBeTruthy();
    unmount();
  });
});

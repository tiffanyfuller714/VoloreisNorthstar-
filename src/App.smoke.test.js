import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

describe('App smoke test', () => {
  beforeAll(() => {
    // JSDOM doesn't implement scrollTo; App calls it on navigation actions.
    if (!window.scrollTo) {
      window.scrollTo = () => {};
    }
    // React 18 act() environment flag to silence warnings in tests.
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  });

  it('renders without crashing and produces content', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let root;
    act(() => {
      root = createRoot(container);
      root.render(<App />);
    });

    expect(container.textContent).toBeTruthy();

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});

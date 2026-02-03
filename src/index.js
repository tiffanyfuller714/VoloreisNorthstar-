import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Mount Guard - Defensive mount function
 * Prevents "Target container is not a DOM element" error (React error #299)
 * by checking for the existence of the mount target before rendering.
 */
function mountApp() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error(
      'Mount Error: Could not find element with id="root". ' +
      'The React app requires a <div id="root"></div> element in the HTML. ' +
      'Please ensure your HTML file includes this mount point.'
    );
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('React app mounted successfully');
  } catch (error) {
    console.error('Failed to mount React app:', error);
  }
}

// Wait for DOM to be ready before attempting to mount
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  // DOM is already ready, mount immediately
  mountApp();
}
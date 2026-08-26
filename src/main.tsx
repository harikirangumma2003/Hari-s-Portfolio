import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// User Timing performance mark for Core Web Vitals audit
if (typeof performance !== 'undefined' && performance.mark) {
  performance.mark('app-init');
}

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);

if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
  performance.mark('app-ready');
  try {
    performance.measure('app-startup-latency', 'app-init', 'app-ready');
  } catch (e) {
    // Ignore if marks missing
  }
}

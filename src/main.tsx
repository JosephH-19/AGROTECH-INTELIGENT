import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './i18n';
import { registerServiceWorker } from '@infrastructure/pwa/serviceWorkerRegistration';
import { initializeContainer } from '@infrastructure/dependency-injection/container';
import { AppProviders } from './providers/AppProviders';

initializeContainer();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);

registerServiceWorker();

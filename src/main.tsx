import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { appLog } from './shared/lib/logger/logger.ts';

// Catcher de erros globais (síncronos)
window.addEventListener('error', (event) => {
  appLog.error('Erro global capturado', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
  });
});

// Catcher de promessas rejeitadas não tratadas (assíncronos)
window.addEventListener('unhandledrejection', (event) => {
  appLog.error('Promessa rejeitada não tratada capturada', {
    reason: event.reason,
  });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

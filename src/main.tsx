import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Seu CSS global
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// URL do manifesto da sua dApp.
// Este arquivo DEVE estar acessível publicamente via HTTPS.
// Você pode hospedá-lo no GitHub Pages, Vercel, Netlify, etc.
// Por agora, usaremos um placeholder. Você precisará criar e hospedar o seu.
const manifestUrl = 'https://<SEU_DOMINIO_OU_CAMINHO_PUBLICO>/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);
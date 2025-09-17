// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { seedDatabase } from './db/seed';

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  console.log("[MSW] Initializing Mock Service Worker...");
  return worker.start().then(() => {
    console.log("[MSW] Mock Service Worker successfully started.");
  });
}

enableMocking().then(() => {
  seedDatabase().then(() => {
    console.log("[DB] Database seeded or already contains data.");
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  });
});


import React from 'react';
import App from './App';
import { HashRouter } from 'react-router-dom';

const root = document.getElementById('root');

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { Toaster } from './components/ui/sonner.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster  richtext/>
    </Provider>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/FinTrack">
        <AuthProvider>
          <CurrencyProvider>
            <App />
            <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1A237E',
                color: '#fff',
              },
              success: {
                style: { background: '#16a34a', color: '#fff' },
              },
              error: {
                style: { background: '#dc2626', color: '#fff' },
                duration: 4000,
              },
            }}
          />
        </CurrencyProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

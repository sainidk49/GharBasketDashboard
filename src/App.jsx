import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppDispatch } from './app/hooks';
import { checkAuth } from './features/auth/authSlice';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#2E7D32',
            },
          },
          error: {
            style: {
              background: '#D32F2F',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;

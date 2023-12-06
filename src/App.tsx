import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainEditor from './modules/components/MainEditor';
import { ThemeProvider } from '@emotion/react';
import { green, indigo } from '@mui/material/colors';
import { createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import routes from './router';
import MainDialog from './components/MainDialog';
import { AuthProvider, useAuth } from './context/auth';
import Routes from './router';
import { PrivateRouter, PublicRouter } from './router/routes';
import { PublicRounded } from '@mui/icons-material';
import Appbar from './modules/components/Appbar';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: indigo['A700'],
    },
    secondary: {
      main: green[500],
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const { state } = useAuth()
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
        <Appbar />
        <RouterProvider router={state.authIsReady && state.user ? PrivateRouter : PublicRouter} />
    </ThemeProvider>
  );
}

export default App;

import './App.css';
import { ThemeProvider } from '@mui/material';
import React from 'react';
import theme from './Util/theme';
import Dashboard from './Pages/Dashboard';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider >
  );
}

export default App;


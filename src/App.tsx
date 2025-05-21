import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';

// 临时占位组件，后续会替换为实际页面组件
const PlaceholderPage = () => <div>Page under construction</div>;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<PlaceholderPage />} />
            <Route path="/orders" element={<PlaceholderPage />} />
            <Route path="/inbound" element={<PlaceholderPage />} />
            <Route path="/customers" element={<PlaceholderPage />} />
            <Route path="/delivery" element={<PlaceholderPage />} />
            <Route path="/users" element={<PlaceholderPage />} />
            <Route path="/reports" element={<PlaceholderPage />} />
            <Route path="/settings" element={<PlaceholderPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;

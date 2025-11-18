import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App as AntdApp, ConfigProvider } from 'antd';
import App from './App.tsx';
import { HeroDataProvider } from './context/HeroDataContext.tsx';
import { GlobalStyles } from './styles/global.ts';
import 'antd/dist/reset.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ff7a18',
          borderRadius: 8,
          fontFamily: '"Noto Sans TC", "Helvetica", "Arial", sans-serif',
        },
      }}
    >
      <AntdApp>
        <GlobalStyles />
        <HeroDataProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HeroDataProvider>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
);

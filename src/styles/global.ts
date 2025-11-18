import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    font-family: 'Noto Sans TC', 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;
    color: #1f1f1f;
    background-color: #f4f5f7;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background-color: #f4f5f7;
  }

  #root {
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

// ThemeContext.js
import React, { createContext, useState } from 'react';

export const ThemeContext = createContext(null);

export const AppWrapper = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
  };

  return (
    <React.StrictMode>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div id={theme}>{children}</div>
      </ThemeContext.Provider>
    </React.StrictMode>
  );
};

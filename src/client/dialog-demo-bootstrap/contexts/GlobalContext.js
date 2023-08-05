import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [globalVariable, setGlobalVariable] = useState('Caleo Silva');

  return (
    <GlobalContext.Provider value={{ nome: 'Caleo Silva' }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
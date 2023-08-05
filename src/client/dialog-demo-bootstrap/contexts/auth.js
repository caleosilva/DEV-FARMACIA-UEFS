import React, { createContext, useState } from 'react';

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    return (
        <AuthContext value={{ nome: 'Caleo Silva' }}>
            {children}
        </AuthContext>
    );
};


export default AuthProvider;
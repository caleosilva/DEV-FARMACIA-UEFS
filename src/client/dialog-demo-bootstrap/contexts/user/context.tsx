import React, { createContext, useState } from 'react';

type UserType = {
    chaveUsuario: string,
    nome: string,
    matricula: string,
    cpf: string,
    email: string,
    tipoUsuario: string
};

type PropsUserContext = {
    state: UserType;
    setState: React.Dispatch<React.SetStateAction<UserType>>;
}

const DEFAULT_VALUE = {
    state: {
        chaveUsuario: "",
        nome: "",
        matricula: "",
        cpf: "",
        email: "",
        tipoUsuario: ""
    },
    setState: () => { },
}

const UserContext = createContext<PropsUserContext>(DEFAULT_VALUE);

const UserContextProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [state, setState] = useState(DEFAULT_VALUE.state);
    return (
        <UserContext.Provider
            value={{
                state,
                setState,
            }}
        >
            {children}
        </UserContext.Provider>
    )
};
export { UserContextProvider };
export default UserContext;

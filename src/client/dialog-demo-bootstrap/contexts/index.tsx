import React from "react";

import { UserContextProvider } from "./user/context";

const GlobalContext: React.FC<React.ReactNode> = ({ children }) => {
    return (
        <>
            <UserContextProvider>{children}</UserContextProvider>
        </>
    )
};

export default GlobalContext;

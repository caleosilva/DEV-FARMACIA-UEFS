import { Navigate, Outlet } from 'react-router-dom';
import NavBarFU from './NavBarFu';
import React from 'react';


const ProtectedRoute = ({
    isAllowed,
    redirectPath = '/acessoNegado', // default value
    children,
}) => {
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />;
    }

    return (
        <>
            <NavBarFU />
            {children ? children : <Outlet />}
        </>
    );
};

export default ProtectedRoute;
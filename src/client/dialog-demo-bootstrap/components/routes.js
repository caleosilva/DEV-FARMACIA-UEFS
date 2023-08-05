import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import { useState, useContext, useEffect } from 'react';

import Home from '../pages/Home';
import TabelaEstoque from '../pages/TabelaEstoque';
import TabelaDoadores from '../pages/TabelaDoadores';
import TabelaMedicamentos from '../pages/TabelaMedicamentos';
import TabelaPacientes from '../pages/TabelaPacientes';
import Sobre from '../pages/Sobre';
import Login from '../pages/Login';
import AcessoNegado from '../pages/AcessoNegado';
import Perfil from '../pages/Perfil';

import ProtectedRoute from './ProtectedRoute';
import UserContext from '../contexts/user/context';


export default function AppRouter() {

    const { setState, state } = useContext(UserContext);

    const allowBolsita = () => {
        if (state != null && state.tipoUsuario == "Bolsista") {
            console.log("Bolsista: ", state.tipoUsuario);
            return true
        } else {
            console.log("Bolsista: ", state.tipoUsuario);
            return false;
        }
    }

    const allowProfessor = () => {
        if (state != null && state.tipoUsuario == "Professor") {
            console.log("Professor: ", state.tipoUsuario);
            return true
        } else {
            console.log("Professor: ", state.tipoUsuario);
            return false;
        }
    }

    // <Route
    //     path="/sobre" // rota que deseja ir
    //     element={
    //         <ProtectedRoute
    //             isAllowed={allowProfessor}
    //         >
    //             <Sobre /> {/* Renderiza o componente */}
    //         </ProtectedRoute>
    //     }
    // />

    return (
        <main>
            <Router>
                <Routes>
                    <Route path='/*' element={<Login />} />

                    <Route path='/acessoNegado' element={<AcessoNegado />} />

                    <Route element={<ProtectedRoute isAllowed={allowBolsita} />}>
                        <Route path='/home' element={<Home />} />
                        <Route path='/medicamentos' element={<TabelaMedicamentos />} />
                        <Route path='/estoque' element={<TabelaEstoque />} />
                        <Route path='/doadores' element={<TabelaDoadores />} />
                        <Route path='/pacientes' element={<TabelaPacientes />} />
                        <Route path='/perfil' element={<Perfil />} />

                        <Route path='/sobre' element={<Sobre />} />
                    </Route>
                </Routes>
            </Router>
        </main>
    );
}
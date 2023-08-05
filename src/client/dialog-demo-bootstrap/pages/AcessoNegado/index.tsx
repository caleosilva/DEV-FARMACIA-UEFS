import React from "react"
import { Outlet } from 'react-router-dom';
import NavBarFU from "../../components/NavBarFu";
import './acessoNegado.css';


export default function AcessoNegado() {

    return (
        <div className="containerAcessoNegado">
            <NavBarFU />

            <section className="content">
                <p>Acesso não permitido!</p>
            </section>
        </div>
    )
}
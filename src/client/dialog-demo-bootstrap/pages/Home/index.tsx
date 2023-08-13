import React from "react";

import { serverFunctions } from '../../../utils/serverFunctions';

import { useState, useEffect } from 'react';


export default function Home() {

    const imgUrl = 'https://drive.google.com/uc?export=view&id=16qmCVDIUekXHsLcYHhbjlNrSjb2nsn-Y';

    // var primeiraEtapa = false;
    // var segundaEtapa = false;

    const [iniciar, setIniciar] = useState(false);
    const [primeiraEtapa, setPrimeiraEtapa] = useState(false);
    const [segundaEtapa, setSegundaEtapa] = useState(false);

    useEffect(() => {
        if (iniciar) {
            console.log("Começando em medicamentos.")
            serverFunctions.atualizarChavesPrimariaMedicamentos().then((sucesso) => {
                if (sucesso) {
                    console.log("SUCESSO: Medicamentos");
                    setPrimeiraEtapa(true);
                    // primeiraEtapa = true;
                } else {
                    console.log("ERRO: Medicamentos");

                }
            }).catch(
                (e) => {
                    console.log(e.stack);
                });
        }

    }, [iniciar]);

    useEffect(() => {
        if (primeiraEtapa) {
            console.log("Começando em medicamento especifico.")

            serverFunctions.atualizarChavesPrimariaMedicamentoEspecifico().then((sucesso) => {
                if (sucesso) {
                    console.log("SUCESSO: MedicamentoEspecifico");
                    setSegundaEtapa(true);
                } else {
                    console.log("ERRO: MedicamentoEspecifico");
                }
            }).catch(
                (e) => {
                    console.log(e.stack);
                });
        }
    }, [primeiraEtapa]);

    useEffect(() => {
        if (segundaEtapa) {
            console.log("Começando no estoque.")

            serverFunctions.atualizarChavesPrimariaEstoque().then((sucesso) => {
                if (sucesso) {
                    console.log("SUCESSO: Estoque");
                } else {
                    console.log("ERRO: Estoque");

                }
            }).catch(
                (e) => {
                    console.log(e.stack);
                });
        }
    }, [segundaEtapa]);

    const handleClick = () => {
        // setIniciar(true);
        console.log("Tem que descomentar pra fazer funcionar");
        setIniciar(false);
    }


    return (
        <div className="d-flex justify-content-center" style={{ marginTop: "100px" }}>
            <img
                alt=""
                src={imgUrl}
                width="400"
                height="400"
                className="d-inline-block align-top"
            />{' '}

            <button onClick={handleClick}>
                Iniciar mudança
            </button>


        </div>
    )
}
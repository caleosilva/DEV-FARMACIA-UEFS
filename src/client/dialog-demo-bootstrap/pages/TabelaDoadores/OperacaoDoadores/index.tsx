import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import React from 'react';

import ModalVerMaisDoador from '../ModalVerMaisDoador';
import ModalExcluirDoador from '../ModalExcluirDoador';
import ModalAtualizarDoador from '../ModalAtualizarDoador';
import Doador from '../../../../../models/Doador';
import ModalEntradaMedicamento from '../ModalEntradaMedicamento';


export default function OperacaoDoadores({ doador, listaDD, data, setData, index, dataMedicamentoGeral, setDataMedicamentoGeral}: { doador: Doador, listaDD: string[][], data: Array<Doador>, setData: Function, index: number, dataMedicamentoGeral: Array<any>, setDataMedicamentoGeral: Function}) {
    return (
        <ButtonGroup aria-label="Basic example">

            <ModalEntradaMedicamento doador={doador} dataMedicamentoGeral={dataMedicamentoGeral} setDataMedicamentoGeral={setDataMedicamentoGeral} listaDD={listaDD}/>

            <ModalVerMaisDoador doador={doador}/>

            <ModalAtualizarDoador doador={doador} index={index} listaDrop={listaDD} data={data} setData={setData}/>

            <ModalExcluirDoador doador={doador} data={data} setData={setData} index={index}/>

        </ButtonGroup>
    );
}


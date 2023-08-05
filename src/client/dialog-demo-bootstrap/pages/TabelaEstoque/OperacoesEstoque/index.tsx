import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import ModalEntradaEstoque from '../ModalEntradaEstoque';
import ModalSaidaEstoque from '../ModalSaidaEstoque';
import ModalVerMaisEstoque from '../ModalVerMaisEstoque';
import ModalAtualizarInformacoesEstoque from '../ModalAtualizarInformacoesEstoque';
import ModalExcluir from '../ModalExcluir';
import MedicamentoEspecifico from '../../../../../models/MedicamentoEspecifico';


export default function OperacoesEstoque({ remedio, listaDD, data, setData, index}: { remedio: MedicamentoEspecifico, listaDD: string[][], data: Array<MedicamentoEspecifico>, setData: Function, index: number}){

    return (
        <ButtonGroup aria-label="Basic example">
            <ModalEntradaEstoque remedio={remedio} listaDD={listaDD} data={data} setData={setData}/>
            <ModalSaidaEstoque remedio={remedio} listaDD={listaDD} data={data} setData={setData}/>
            <ModalVerMaisEstoque remedio={remedio}/>
            <ModalAtualizarInformacoesEstoque remedio={remedio} listaDD={listaDD} data={data} setData={setData} index={index}/>
            <ModalExcluir remedio={remedio} data={data} setData={setData} index={index}/>
        </ButtonGroup>
    )
}
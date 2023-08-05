import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import MedModalVerMais from '../ModalVerMaisMedicamentos';
import MedModalAtualizar from '../ModalAtualizarMedicamentos';
import MedicamentoGeral from '../../../../../models/MedicamentoGeral'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

import { Link, useNavigate } from 'react-router-dom';

import ModalTabelaEstoque from '../../TabelaEstoque'



export default function OperacoesMedicamento({ remedio, index, listaDD, data, setData }:
    { remedio: MedicamentoGeral, index: number, listaDD: string[][], data: Array<MedicamentoGeral>, setData: Function }) {

    const navigate = useNavigate();

    const handleNavigateEstoque = () => {
        navigate('/estoque', { state: { remedio } })
    }

    function renderOpcaoEstoque() {

        const renderTooltip = (props) => (
            <Tooltip id="button-tooltip" {...props}>
                Estoque
            </Tooltip>
        )

        return (
            <OverlayTrigger
                placement="left"
                delay={{ show: 400, hide: 250 }}
                overlay={renderTooltip}
            >
                <Button variant="outline-primary" onClick={()=> {handleNavigateEstoque()}}>
                <i className="bi bi-archive-fill"></i>

                </Button>
            </OverlayTrigger>
        )
    }

    return (
        <ButtonGroup aria-label="Basic example">
            {renderOpcaoEstoque()}
            <MedModalVerMais remedio={remedio} />
            <MedModalAtualizar remedio={remedio} index={index} listaDrop={listaDD} data={data} setData={setData} />
        </ButtonGroup>
    )
}
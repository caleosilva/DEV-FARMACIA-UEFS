import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Paciente from '../../../../../models/Paciente';
import ModalVerMaisPaciente from '../ModalVerMaisPaciente';
import ModalExcluirPaciente from '../ModalExcluirPaciente';
import ModalAtualizarPaciente from '../ModalAtualizarPaciente';
import ModalSaidaMedicamento from '../ModalSaidaMedicamento';

import React from 'react';

export default function operacoesPaciente({ paciente, listaDD, data, setData, index }: { paciente: Paciente, listaDD: string[][], data: Array<Paciente>, setData: Function, index: number }) {
    return (
        <ButtonGroup aria-label="Basic example">
            <ModalSaidaMedicamento paciente={paciente} data={data} setData={setData} index={index} />

            <ModalVerMaisPaciente paciente={paciente} />

            <ModalAtualizarPaciente paciente={paciente} index={index} listaDrop={listaDD} data={data} setData={setData} />

            <ModalExcluirPaciente paciente={paciente} data={data} setData={setData} index={index} />
        </ButtonGroup>
    );
}


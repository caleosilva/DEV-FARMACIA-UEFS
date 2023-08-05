import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import React from 'react';


import './InputBuscar.css'


function InputBuscar({ placeholder }) {
    const opcoes = [
        'Opção 1',
        'Opção 2',
        'Opção 3',
        'Opção 4'
    ];

    return (
        <div>
            <input
                type="text"
                list="opcoes"
                placeholder="Selecione uma opção"
            />
            <datalist id="opcoes">
                {opcoes.map((opcao, index) => (
                    <option key={index} value={opcao} />
                ))}
            </datalist>
        </div>
    );
}


export default InputBuscar;
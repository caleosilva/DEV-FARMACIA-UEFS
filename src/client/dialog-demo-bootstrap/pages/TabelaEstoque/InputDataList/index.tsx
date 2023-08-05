import React from 'react';
import Form from 'react-bootstrap/Form';


export default function InputDataList(
    { label, placeholder, controlId, data, setData, options, listaId }:
        { label: string, placeholder: string, controlId: string, data: string, setData: Function, options: [any], listaId: string }) {

    return (
        <Form.Group className="mb-3" controlId={controlId}>
            <Form.Label className='labelInputConfig'>{label}</Form.Label>
            <Form.Control
                type={"text"}
                list={listaId}
                placeholder={placeholder}
                value={data}
                onChange={(e) => setData(e.target.value)} />

            <datalist id={listaId}>
                {options.map((option, index) => (
                    <option key={index} value={option.nome} label={option.chaveDoador}/>
                ))}

            </datalist>
        </Form.Group>

    );
}
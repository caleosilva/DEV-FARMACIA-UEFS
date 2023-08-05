import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';


export default function InputSelect({ label, name, data, setData, required, lista }:
    { label: string, name: string, data: any, setData: Function, required: boolean, lista: [any] }) {

    const labelIndentificadora = (op: any) => {
        if (op.cpf === 'null'){
            return `${op.nome}, ${op.cnpj}`;
        } else {
            return `${op.nome}, ${op.cpf}`;
        }
    }

    return (
        <section className='mb-3'>
            <Form.Label >{label}</Form.Label>
            <Form.Select
                required={required}
                aria-label={label}
                name={name}
                value={data}
                onChange={(e) => setData(e.target.value)}>

                <option></option>

                {lista?.map((op, index) =>
                    
                    <option key={index} value={op.chaveDoador}>
                        {labelIndentificadora(op)}
                    </option>

                )}
            </Form.Select>
        </section>
    )
}

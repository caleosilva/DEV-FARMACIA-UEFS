import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';


export default function InputSelect({ label, name, data, setData, required, lista }:
    { label: string, name: string, data: string, setData: Function, required: boolean, lista: Array<string> }) {
    return (
        <section className='mb-3'>
            <Form.Label ><h6>{label}</h6></Form.Label>
            <Form.Select
                required={required}
                aria-label={label}
                name={name}
                value={data}
                onChange={(e) => setData(e.target.value)}>
                <option>{data}</option>
                {lista?.map((info) =>
                    <option key={info} value={info}>{info}</option>
                )}
            </Form.Select>
        </section>
    )
}

import './InputCnpj.css'
import Form from 'react-bootstrap/Form';
import React from 'react';


export default function InputCnpj({ label, placeholder, controlId, name, data, setData }:
  { label: string, placeholder: string, controlId: string, name: string, data: string, setData: Function }) {

  const handleChange = (event) => {
    const { value } = event.target;

    // Deixa somente os números
    const cnpjLimpo = value.replace(/\D/g, '');

    let cnpjComMascara = '';
    if (cnpjLimpo.length <= 2) {
      cnpjComMascara = cnpjLimpo;
    } else if (cnpjLimpo.length <= 5) {
      cnpjComMascara = `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2)}`;
    } else if (cnpjLimpo.length <= 8) {
      cnpjComMascara = `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5)}`;
    } else if (cnpjLimpo.length <= 12) {
      cnpjComMascara = `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5, 8)}/${cnpjLimpo.slice(8)}`;
    } else {
      cnpjComMascara = `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5, 8)}/${cnpjLimpo.slice(8, 12)}-${cnpjLimpo.slice(12, 14)}`;
    }
    setData(cnpjComMascara);
  }

  return (
    <Form.Group className="mb-3" controlId={controlId}>
      <Form.Label className='labelInputConfig'><h6>{label}</h6></Form.Label>
      <Form.Control
        type={'text'}
        placeholder={placeholder}
        name={name}
        value={data}
        onChange={(e) => handleChange(e)} />
    </Form.Group>
  );
}
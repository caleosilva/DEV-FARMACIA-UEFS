import './InputCpf.css'
import Form from 'react-bootstrap/Form';
import React from 'react';


export default function InputCpf({ label, placeholder, controlId, name, data, setData }:
  { label: string, placeholder: string, controlId: string, name: string, data: string, setData: Function }) {

  const handleChange = (event) => {
    const { value } = event.target;

    // Deixa somente os números
    const cpfLimpo = value.replace(/\D/g, '');

    let cpfComMascara = '';
    if (cpfLimpo.length <= 3) {
      cpfComMascara = cpfLimpo;
    } else if (cpfLimpo.length <= 6) {
      cpfComMascara = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3)}`;
    } else if (cpfLimpo.length <= 9) {
      cpfComMascara = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6)}`;
    } else {
      cpfComMascara = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6, 9)}-${cpfLimpo.slice(9, 11)}`;
    }
    setData(cpfComMascara);
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
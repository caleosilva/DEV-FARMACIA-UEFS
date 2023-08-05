import './InputTelefone.css'
import Form from 'react-bootstrap/Form';
import React from 'react';


export default function InputTelefone({ label, placeholder, controlId, name, data, setData }:
  { label: string, placeholder: string, controlId: string, name: string, data: string, setData: Function }) {

  const handleChange = (event) => {
    const inputTelefone = event.target.value;

    // Remove todos os caracteres não numéricos do telefone
    const telefoneApenasNumeros = inputTelefone.replace(/\D/g, '');

    let telefoneComMascara = '';
    if (telefoneApenasNumeros.length <= 2) {
      telefoneComMascara = telefoneApenasNumeros;
    } else if (telefoneApenasNumeros.length <= 7) {
      telefoneComMascara = `(${telefoneApenasNumeros.slice(0, 2)}) ${telefoneApenasNumeros.slice(2)}`;
    } else if (telefoneApenasNumeros.length <= 10) {
      telefoneComMascara = `(${telefoneApenasNumeros.slice(0, 2)}) ${telefoneApenasNumeros.slice(2, 6)}-${telefoneApenasNumeros.slice(6)}`;
    } else {
      telefoneComMascara = `(${telefoneApenasNumeros.slice(0, 2)}) ${telefoneApenasNumeros.slice(2, 7)}-${telefoneApenasNumeros.slice(7, 11)}`;
    }
    setData(telefoneComMascara);
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
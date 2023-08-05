import './InputText.css'
import Form from 'react-bootstrap/Form';
import React from 'react';


// value para defaultValue={value} retirado
function InputText({ type, label, placeholder, controlId, name, data, setData, required }:
  { type: string, label: string, placeholder: string, controlId: string, name: string, data: string, setData: Function, required: boolean }) {

  return (
    <Form.Group className="mb-3" controlId={controlId}>
      <Form.Label className='labelInputConfig'><h6>{label}</h6></Form.Label>
      <Form.Control
        type={type}
        required={required}
        placeholder={placeholder}
        name={name}
        value={data}
        onChange={(e) => setData(e.target.value)} />
    </Form.Group>

  );
}

export default InputText;
import './InputText.css'
import Form from 'react-bootstrap/Form';
import React from 'react';


// value para defaultValue={value} retirado
export default function InputPositiveNumber({ label, placeholder, controlId, name, data, setData, required, max }:
  { label: string, placeholder: string, controlId: string, name: string, data: string, setData: Function, required: boolean, max: number }) {

  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Deixa somente os números
    const cleanInputValue = inputValue.replace(/\D/g, '');

    if (cleanInputValue === '' || (parseFloat(cleanInputValue) > 0 && parseFloat(cleanInputValue) <= max)) {
      setData(cleanInputValue);
    }
  }

  return (
    <Form.Group className="mb-3" controlId={controlId}>
      <Form.Label className='labelInputConfig'><h6>{label}</h6></Form.Label>
      <Form.Control
        type={"text"}
        required={required}
        placeholder={placeholder}
        name={name}
        value={data}
        onChange={handleChange} />
    </Form.Group>

  );
}
import Form from 'react-bootstrap/Form';
import React from 'react'


function ExibirInputSimples({label, data, controlId}) {
  return (
    <Form.Group className="mb-3" controlId={controlId} >
        <Form.Label className='labelInputConfig'><h6>{label}</h6></Form.Label>
        <Form.Control plaintext readOnly defaultValue={data}/>
        <hr></hr>
    </Form.Group>
  );
}

export default ExibirInputSimples;
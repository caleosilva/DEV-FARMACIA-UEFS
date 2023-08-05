import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import React from 'react';

export default function operacoesExemplo() {
    return (
        <ButtonGroup aria-label="Basic example">
            <Button variant="outline-secondary">
                <i className="bi bi-arrows-angle-expand"></i>
            </Button>

            <Button variant="outline-secondary">
                <i className="bi bi-pencil-square"></i>
            </Button>

            <Button variant="outline-danger">
                <i className="bi bi-trash-fill"></i>
            </Button>
        </ButtonGroup>
    );
}


import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { Form } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import React, { useState, useContext } from 'react';

import ExibirInputSimples from '../../components/ExibirInputSimples';
import formatarDataParaVisualizacao from '../../Functions/formatarDataParaVisualizacao';
import UserContext from '../../contexts/user/context';
import ModalAtualizarSenha from './ModalAtualizarSenha';


export default function Perfil() {

    const { setState, state } = useContext(UserContext);

    return (
        <section className='margemNavBar ms-5 me-5'>

            <Card>
                <Card.Header>

                    <Container fluid>
                        <Row className=''>
                            <Col className='d-flex justify-content-center'>
                                <h5>
                                    Informações pessoais
                                </h5>
                            </Col>
                        </Row>

                    </Container>
                </Card.Header>
                <Card.Body>
                    <Row className='mb-5'>
                        <Col sm={6}>
                            <h6 className='mb-3'>Nome</h6>
                            <p>{state.nome}</p>
                        </Col>

                        <Col sm={6}>
                            <h6 className='mb-3'>Matrícula</h6>
                            <p>{state.matricula}</p>
                        </Col>
                    </Row>

                    <Row className='mb-5'>
                        <Col sm={6}>
                            <h6 className='mb-3'>CPF</h6>
                            <p>{state.cpf}</p>
                        </Col>

                        <Col sm={6}>
                            <h6 className='mb-3'>Email</h6>
                            <p>{state.email}</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col className='d-flex justify-content-center'>
                            <ModalAtualizarSenha cpf={state.cpf}/>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

        </section>
    );
}
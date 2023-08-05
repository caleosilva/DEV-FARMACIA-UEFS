import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { InputGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import React from 'react';
import { useState, useEffect } from 'react';

import MedModalCadastrar from './ModalCadastrarMedicamento';
import OperacoesMedicamento from './OperacoesMedicamento'
import { serverFunctions } from '../../../utils/serverFunctions';
import formatarDataParaVisualizacao from '../../Functions/formatarDataParaVisualizacao';
import '../style.css'
import './TabelaMedicamentos.css'

function TabelaMedicamentos() {

    const [data, setData] = useState(null);
    const [infoDD, setInfoDD] = useState(null);

    function renderTable() {
        if (data == null) {
            return (
                <div className='d-flex justify-content-center'>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )
        } else if (data == false) {
            return (
                <Alert key={"infoTabela"} variant={"dark"}>
                    Não há medicamentos cadastrados!
                </Alert>
            )
        } else {
            return (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th style={{ width: '20%' }} >Nome</th>
                                <th style={{ width: '20%' }} >Princípio ativo</th>
                                <th style={{ width: '20%' }} >Apresentação</th>
                                <th style={{ width: '15%' }} >Quantidade</th>
                                <th style={{ width: '15%' }} >Validade</th>
                                <th style={{ width: '10%' }} >Operações</th>


                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {data ? data.filter((item) => {
                                    return busca.toLowerCase() === ''
                                        ? item
                                        : item.nome.toLowerCase().includes(busca.toLowerCase()) ||
                                        item.principioAtivo.toLowerCase().includes(busca.toLowerCase())
                                }).map((remedio, index) => {
                                    return renderInformacoes(remedio, index);
                                }) : ''}
                            </>
                        </tbody>
                    </Table>
                </>
            )
        }
    }

    function renderInformacoes(remedio, index) {

        var validade = remedio.validadeMaisProxima;
        var validadeFormatada = '-';

        if (validade !== '-') {
            validadeFormatada = formatarDataParaVisualizacao(validade)
        }

        return (
            <tr key={index}>
                <td>{remedio.nome}</td>
                <td>{remedio.principioAtivo}</td>
                <td>{remedio.apresentacao}</td>
                <td>{remedio.quantidadeTotal}</td>
                <td>{validadeFormatada}</td>
                <td>
                    <OperacoesMedicamento remedio={remedio} index={index} listaDD={infoDD} data={data} setData={setData} />
                </td>
            </tr>
        )
    }

    useEffect(() => {
        serverFunctions.getMedicamentos().then(string => { setData(JSON.parse(string)) }).catch(alert);
    }, []);

    useEffect(() => {
        serverFunctions.getInformacoesSelect().then(string => { setInfoDD(JSON.parse(string)) }).catch(alert);
    }, []);

    useEffect(() => {
        renderTable();
    }, [data]);



    const [busca, setBusca] = useState('');

    return (
        <section className='margemNavBar ms-5 me-5'>
            <Card>

                <Card.Header>

                    <Container fluid>
                        <Row className=''>
                            <Col md={3} className='d-flex justify-content-center align-items-center mb-2 mt-1'>
                                <h5 className='noPaddingNoMargin'>Medicamentos</h5>
                            </Col>

                            <Col md={6} className='d-flex justify-content-center align-items-center mb-2 mt-1'>
                                <InputGroup className='buscar'>
                                    <Form.Control
                                        placeholder={"Busque pelo nome ou princípio ativo"}
                                        aria-label={"Nome do medicamento"}
                                        aria-describedby="basic-addon2"
                                        value={busca}
                                        onChange={(ev) => setBusca(ev.target.value)}
                                    />
                                    <InputGroup.Text>
                                        <i className="bi bi-search"></i>

                                    </InputGroup.Text>
                                </InputGroup>
                            </Col>

                            <Col md={3} className='d-flex justify-content-center align-items-center mb-2 mt-1'>
                                <MedModalCadastrar
                                    listaDD={infoDD}
                                    data={data}
                                    setData={setData}
                                />
                            </Col>
                        </Row>
                    </Container>

                    {/* <Navbar>
                        <Container fluid>
                            <Navbar.Brand href="">Medicamentos</Navbar.Brand>
                            <InputGroup className='buscar'>
                                <Form.Control
                                    placeholder={"Busque pelo nome ou princípio ativo"}
                                    aria-label={"Nome do medicamento"}
                                    aria-describedby="basic-addon2"
                                    value={busca}
                                    onChange={(ev) => setBusca(ev.target.value)}
                                />
                                <InputGroup.Text>
                                    <i className="bi bi-search"></i>

                                </InputGroup.Text>
                            </InputGroup>

                            <MedModalCadastrar
                                listaDD={infoDD}
                                data={data}
                                setData={setData}
                            />
                        </Container>
                    </Navbar> */}

                </Card.Header>
                <Card.Body>
                    {renderTable()}
                </Card.Body>
            </Card>
        </section>
    )
}

export default TabelaMedicamentos;
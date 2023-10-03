import { InputGroup } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useEffect, useState } from 'react';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import { serverFunctions } from '../../../utils/serverFunctions';
import OperacoesEstoque from './OperacoesEstoque';
import '../style.css';
import ModalEstoqueCadastrar from './ModalEstoqueCadastrar';
import formatarDataParaVisualizacao from '../../Functions/formatarDataParaVisualizacao';


export default function TabelaEstoque() {
    // Carrega a informação da página anterior
    const location = useLocation();
    const infoMedicamentoGeral = location.state.remedio;

    const [dataDoadores, setDataDoadores] = useState(null);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    const [busca, setBusca] = useState('');

    // Server: 
    const [data, setData] = useState(null);
    const [infoDD, setInfoDD] = useState(null);

    const isDateBeforeToday = (date) => {
        const currentDate = new Date();
        const inputDate = new Date(date);

        // Removendo as informações de horas, minutos, segundos e milissegundos
        currentDate.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);

        return inputDate < currentDate;
    };

    useEffect(() => {
        serverFunctions.getMedEspecificoChaveMedGeral(infoMedicamentoGeral.chaveGeral).then(string => {
            setData(JSON.parse(string));
        }).catch(alert);

    }, []);

    useEffect(() => {
        serverFunctions.getInformacoesSelect().then(string => { setInfoDD(JSON.parse(string)) }).catch(alert);
    }, []);

    useEffect(() => {
        renderTable();
    }, [data]);

    useEffect(() => {
        serverFunctions.getDoadores().then(string => { setDataDoadores(JSON.parse(string)) }).catch(alert);
    }, []);

    function renderDataFormatada(data) {
        var antes = isDateBeforeToday(data);
        if (antes) {
            return (
                <td style={{ color: 'red' }}>{formatarDataParaVisualizacao(data)}</td>
            )
        } else {
            return (
                <td >{formatarDataParaVisualizacao(data)}</td>
            )
        }
    }

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
                    Não há doações registradas para esse medicamento!
                </Alert>
            )
        } else {
            ordenarPorValidade(data);

            return (

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th style={{ width: '20%' }} >Lote</th>
                            <th style={{ width: '20%' }} >Validade</th>
                            <th style={{ width: '20%' }} >Dosagem</th>
                            <th style={{ width: '20%' }} >Quantidade</th>
                            <th style={{ width: '10%' }} >Operações</th>

                        </tr>
                    </thead>
                    <tbody>
                        <>
                            {data ? data.filter((item) => {
                                return busca.toLowerCase() === ''
                                    ? item
                                    : item.lote.toLowerCase().includes(busca.toLowerCase()) ||
                                    item.dosagem.toLowerCase().includes(busca.toLowerCase())

                            }).map((medicamento, index) => {
                                return renderInformacoes(medicamento, index);
                            }) : ''}
                        </>
                    </tbody>
                </Table>
            )
        }
    }

    function renderInformacoes(medicamento, index) {

        const indiceReal = data.findIndex((item) => item === medicamento); // Encontrar o índice real do item

        return (
            <tr key={index}>
                <td>{medicamento.lote}</td>
                {renderDataFormatada(medicamento.validade)}
                <td>{medicamento.dosagem}</td>
                <td>{medicamento.quantidade}</td>
                <td>
                    <OperacoesEstoque remedio={medicamento} listaDD={infoDD} data={data} setData={setData} index={indiceReal} />
                </td>
            </tr>
        )
    }

    function converterParaData(dateStr) {
        const partesData = dateStr.split('T')[0].split('-');
        const ano = parseInt(partesData[0]);
        const mes = parseInt(partesData[1]) - 1; // Subtrai 1 do mês porque em JavaScript os meses são indexados a partir de 0 (janeiro é 0)
        const dia = parseInt(partesData[2]);

        return new Date(ano, mes, dia);
    }

    function compararDatas(dateStr1, dateStr2) {
        const date1 = converterParaData(dateStr1);
        const date2 = converterParaData(dateStr2);

        return date1.getTime() - date2.getTime();
    }

    function ordenarPorValidade(lista) {
        lista.sort((a, b) => compararDatas(a.validade, b.validade));
    }


    return (
        <section className='margemNavBar ms-5 me-5'>
            <Card style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                <Card.Header style={{ position: 'sticky', top: '0', backgroundColor: '#f8f8f8', zIndex: '1' }}>

                    <Container fluid>
                        <Row>
                            <Breadcrumb>
                                <Breadcrumb.Item onClick={handleBack} >
                                    <h6>
                                        Medicamentos
                                    </h6>

                                </Breadcrumb.Item>
                                <Breadcrumb.Item active style={{ minWidth: '80vh' }} >
                                    <h6>{infoMedicamentoGeral.nome}, {infoMedicamentoGeral.principioAtivo}, {infoMedicamentoGeral.apresentacao}</h6>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </Row>

                        <Row className=''>
                            <Col md={3} className='d-flex justify-content-center align-items-center mb-2 mt-1'>
                                <h5 className='noPaddingNoMargin'>Controle de estoque</h5>
                            </Col>

                            <Col md={6} className='d-flex justify-content-center align-items-center mb-2 mt-1'>
                                <InputGroup className='buscar'>
                                    <Form.Control
                                        placeholder={"Busque pelo lote ou dosagem"}
                                        aria-label={"lote ou dosagem"}
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
                                <ModalEstoqueCadastrar data={data} setData={setData} listaDD={infoDD} chaveMedicamentoGeral={infoMedicamentoGeral.chaveGeral} listaDoadores={dataDoadores} />
                            </Col>
                        </Row>
                    </Container>
                </Card.Header>
                <Card.Body>

                    {renderTable()}
                </Card.Body>
            </Card>

        </section>
    );
}
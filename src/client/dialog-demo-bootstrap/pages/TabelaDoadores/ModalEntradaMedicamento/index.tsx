import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';
import Accordion from 'react-bootstrap/Accordion';

import ExibirInputSimples from '../../../components/ExibirInputSimples';
import Paciente from '../../../../../models/Paciente';
import Doador from '../../../../../models/Doador';
import formatarDataParaVisualizacao from '../../../Functions/formatarDataParaVisualizacao';
import './estiloModalSaida.css';
import AccordionitemUnico from './AccordionItemUnico/AccordionItemUnico';
import { serverFunctions } from '../../../../utils/serverFunctions';


import React, { useState, useEffect } from 'react';


export default function ModalEntradaMedicamento({ doador, dataMedicamentoGeral, setDataMedicamentoGeral, listaDD }: { doador: Doador, dataMedicamentoGeral: Array<any>, setDataMedicamentoGeral: Function, listaDD: string[][] }) {

    // Carrega os dados do DropDown
    const [lista, setLista] = useState([[]]);

    // CRIAR OS USESTATE
    const [mensagem, setMensagem] = useState(false);
    const [mensagemErroBack, setMensagemErroBack] = useState(false);
    const [show, setShow] = useState(false);

    const [valor, setValor] = useState(1);
    const [quantidadePreenchida, setQuantidadePreenchida] = useState(0);

    const accordions = [];

    const handleClose = () => {
        if (quantidadePreenchida >= accordions.length) {
            setValor(1);
            setQuantidadePreenchida(0);
            setShow(false);
            setMensagem(false);
        } else {
            setMensagem(true);
        }
    };

    const handleCancelar = () => {
        setValor(1);
        setQuantidadePreenchida(0);
        setShow(false);
        setMensagem(false);
    };

    const handleShow = () => setShow(true);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Registrar entrada
        </Tooltip>
    );

    const renderTooltipCancelar = (props) => (
        <Tooltip id="button-tooltip" {...props} className='custom-tooltip me-2'>
            Ao cancelar, todos os registros incompletos serão descartados!
        </Tooltip>
    );

    const handleSubtrair = () => {
        if (valor > 1) {
            setValor(valor - 1);
        }
        setMensagem(false);

    }

    const handleSomar = () => {
        if (valor < 9) {
            setValor(valor + 1);
        }
        setMensagem(false);
    }

    function renderAccordionItemUnico() {

        for (let i = 1; i <= valor; i++) {
            accordions.push(<AccordionitemUnico eventKey={i.toString()} doador={doador} dataMedicamentoGeral={dataMedicamentoGeral} setDataMedicamentoGeral={setDataMedicamentoGeral} lista={lista} quantidadePreenchida={quantidadePreenchida} setQuantidadePreenchida={setQuantidadePreenchida} />);
        }
        return accordions;
    }

    function renderErroBack() {
        if (mensagemErroBack) {
            return (
                <Row className='mb-3 mt-3'>
                    <Col>
                        <Alert variant="dark" onClose={() => setMensagemErroBack(false)} dismissible>
                            <Alert.Heading>Erro!</Alert.Heading>
                            <p>
                                Não foi possível cadastrar a doação, tente novamente mais tarde!
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    function renderErroQuantidade() {
        if (mensagem) {
            return (
                <Row className='mb-3 mt-3'>
                    <Col>
                        <Alert variant="warning" onClose={() => setMensagem(false)} dismissible>
                            <Alert.Heading>Atenção</Alert.Heading>
                            <p>
                                Para concluir é necesário finalizar o registro de todos os medicamentos!
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    function renderInformacoesDoador() {
        var dadosBrevesDoador;
        if (doador.tipoDoador == "Pessoa física") {
            dadosBrevesDoador = `${doador.nome}, ${formatarDataParaVisualizacao(doador.dataNascimento)}`;
        } else if (doador.tipoDoador == "Pessoa jurídica") {
            dadosBrevesDoador = `${doador.nome}, ${doador.cnpj}`;
        } else {
            dadosBrevesDoador = `${doador.nome}, ${doador.endereco} - ${doador.numero}`;
        }

        return (
            <Row className='mb-4'>
                <Col sm={6}>
                    <ExibirInputSimples label={"Informações do doador"} data={dadosBrevesDoador} controlId={"exibirDados"} />
                </Col>


                <Col sm={6} className='d-flex justify-content-center'>

                    <div className='border inputQuantidade '>
                        <Row>
                            <h6 className='d-flex justify-content-center mt-1'>Medicamentos</h6>
                        </Row>

                        <Row className="mt-3">

                            <Col className='d-flex justify-content-center align-items-center'>
                                <Button variant="outline-dark" className='botaoRedondo' onClick={handleSubtrair}>
                                    <i className="bi bi-dash"></i>
                                </Button>

                                <h6 className='ms-3 me-3 mt-2'>{valor}</h6>
                                
                                <Button variant="outline-dark" className='botaoRedondo' onClick={handleSomar}>
                                    <i className="bi bi-plus"></i>
                                </Button>
                            </Col>

                        </Row>
                    </div>



                </Col>
            </Row>

        )
    }

    useEffect(() => {
        setLista(listaDD)
    }, [listaDD]);

    return (

        <>
            <OverlayTrigger
                placement="left"
                delay={{ show: 400, hide: 250 }}
                overlay={renderTooltip}
            >
                <Button variant="outline-secondary" onClick={handleShow}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box2-heart" viewBox="0 0 16 16">
                        <path d="M8 7.982C9.664 6.309 13.825 9.236 8 13 2.175 9.236 6.336 6.31 8 7.982Z" />
                        <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4h-8.5Zm0 1H7.5v3h-6l2.25-3ZM8.5 4V1h3.75l2.25 3h-6ZM15 5v10H1V5h14Z" />
                    </svg>
                </Button>
            </OverlayTrigger>

            <Modal
                dialogClassName='modal-dialog-scrollable'
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}

                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Header closeButton>
                    <Modal.Title>Entrada de medicamento(s)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='mb-5'>

                        {renderInformacoesDoador()}

                        <Accordion>
                            {renderAccordionItemUnico()}
                        </Accordion>

                        {renderErroQuantidade()}

                        {renderErroBack()}

                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <div className='mt-3 mb-3'>


                        <OverlayTrigger
                            placement="left"
                            delay={{ show: 500, hide: 150 }}
                            overlay={renderTooltipCancelar}
                        >
                            <Button variant="outline-secondary" onClick={handleCancelar} className='me-5'>
                                Cancelar
                            </Button>
                        </OverlayTrigger>

                        <Button variant="dark" onClick={handleClose} className=''>
                            Concluir
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
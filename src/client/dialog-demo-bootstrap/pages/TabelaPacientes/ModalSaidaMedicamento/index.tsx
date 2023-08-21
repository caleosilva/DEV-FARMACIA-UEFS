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
import formatarDataParaVisualizacao from '../../../Functions/formatarDataParaVisualizacao';
import './estiloModalSaida.css';
import AccordionitemUnico from './AccordionItemUnico/AccordionItemUnico';
import { serverFunctions } from '../../../../utils/serverFunctions';


import React, { useState, useEffect } from 'react';


export default function ModalSaidaMedicamento({ paciente, dataMedicamentoGeral, setDataMedicamentoGeral }: { paciente: Paciente, dataMedicamentoGeral: Array<any>, setDataMedicamentoGeral: Function}) {

    // const [dataMedicamentoGeral, setDataMedicamentoGeral] = useState(null);

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

    const renderTooltipCancelar = (props) => (
        <Tooltip id="button-tooltip" {...props} className='custom-tooltip me-2'>
            Ao cancelar, todos os registros incompletos serão descartados!
        </Tooltip>
    );

    const handleShow = () => setShow(true);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Registrar saída
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

    function renderErroQuantidade() {
        if (mensagem) {
            return (
                <Row className='mb-3 mt-3'>
                    <Col>
                        <Alert variant="warning" onClose={() => setMensagem(false)} dismissible>
                            <Alert.Heading>Atenção</Alert.Heading>
                            <p>
                                Para concluir é necesário finalizar o cadastro de todos os medicamentos!
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    function renderAccordionItemUnico() {
        for (let i = 1; i <= valor; i++) {
            accordions.push(<AccordionitemUnico eventKey={i.toString()} paciente={paciente} dataMedicamentoGeral={dataMedicamentoGeral} setDataMedicamentoGeral={setDataMedicamentoGeral} quantidadePreenchida={quantidadePreenchida} setQuantidadePreenchida={setQuantidadePreenchida} />);
        }
        return accordions;
    }

    function renderInformacoesPaciente() {
        const dadosBrevesPaciente = `${paciente.nome}, ${formatarDataParaVisualizacao(paciente.dataNascimento)}`;

        return (
            <Row className='mb-4'>
                <Col sm={6}>
                    <ExibirInputSimples label={"Informações do paciente"} data={dadosBrevesPaciente} controlId={"exibirDados"} />
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

    // useEffect(() => {
    //     serverFunctions.getMedicamentos().then(dados => { setDataMedicamentoGeral(JSON.parse(dados)) }).catch(alert);
    // }, []);

    // useEffect(() => {
    //     if (dataMedicamentoGeral === null) {
    //         serverFunctions.getMedicamentos().then(dados => { setDataMedicamentoGeral(JSON.parse(dados)) }).catch(alert);
    //     }
    // }, [dataMedicamentoGeral]);

    return (

        <>
            <OverlayTrigger
                placement="left"
                delay={{ show: 400, hide: 250 }}
                overlay={renderTooltip}
            >
                <Button variant="outline-secondary" onClick={handleShow}>
                    <i className="bi bi-dash-circle"></i>

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
                    <Modal.Title>Saída de medicamento(s)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='mb-5'>

                        {renderInformacoesPaciente()}

                        <Accordion>
                            {renderAccordionItemUnico()}
                        </Accordion>

                        {renderErroQuantidade()}

                        <Row className='mb-3 mt-3'>
                            {mensagemErroBack &&
                                <Col>
                                    <Alert variant="dark" onClose={() => setMensagemErroBack(false)} dismissible>
                                        <Alert.Heading>Erro!</Alert.Heading>
                                        <p>
                                            Não foi possível excluir o registro, tente novamente mais tarde!
                                        </p>
                                    </Alert>
                                </Col>
                            }
                        </Row>

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
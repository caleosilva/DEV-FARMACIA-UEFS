import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';

import { serverFunctions } from '../../../../utils/serverFunctions';
import ExibirInputSimples from '../../../components/ExibirInputSimples';
import Paciente from '../../../../../models/Paciente';
import formatarData from '../../../Functions/formatarData';
import formatarDataParaVisualizacao from '../../../Functions/formatarDataParaVisualizacao';

import React, { useState, useEffect } from 'react';


export default function ModalExcluirPaciente({ paciente, data, setData, index }: { paciente: Paciente, data: Array<Paciente>, setData: Function, index: number }) {

    // CRIAR OS USESTATE
    const [mensagem, setMensagem] = useState(false);
    const [mensagemErroBack, setMensagemErroBack] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => setShow(true);


    const handleClick = () => setLoading(true);
    const [isLoading, setLoading] = useState(false);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Escluir registro
        </Tooltip>
    );

    useEffect(() => {

        if (isLoading) {
            serverFunctions.removeRowPaciente(paciente).then((sucesso) => {
                if (sucesso) {
                    // Atualiza a tabela:
                    const novaLista = data.filter((item, posicao) => posicao !== index);
                    setData(novaLista);

                    setLoading(false);
                    setMensagem(false);
                    handleClose();
                } else {
                    setLoading(false);
                    setMensagem(true);
                }
            }).catch(
                (e) => {
                    console.log(e.stack);
                    setMensagemErroBack(true);
                    setLoading(false);
                });

        }
    }, [isLoading]);

    function renderAlertaErro() {
        if (mensagem) {
            return (
                <Row>
                    <Col>
                        <Alert variant="danger" onClose={() => setMensagem(false)} dismissible>
                            <Alert.Heading>Erro!</Alert.Heading>
                            <hr />
                            <p>
                                Não foi possível excluir o paciente, tente novamente mais tarde.
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    return (

        <>
            <OverlayTrigger
                placement="left"
                delay={{ show: 400, hide: 250 }}
                overlay={renderTooltip}
            >
                <Button variant="outline-danger" onClick={handleShow}>
                    <i className="bi bi-trash-fill"></i>
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
                    <Modal.Title>Exclusão de registro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <Alert variant="warning">
                                    <Alert.Heading>Atenção!</Alert.Heading>
                                    <p>
                                        Após confirmar a exclusão, NÃO será possível reverter essa operação!
                                    </p>
                                </Alert>
                            </Col>
                        </Row>

                        <Row className='mb-4'>
                            <h6>
                                Revisar informações
                            </h6>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Nome"} data={paciente.nome} controlId={"exibirNome"} />
                            </Col>

                            <Col sm={3}>
                                <ExibirInputSimples label={"CPF"} data={paciente.cpf} controlId={"exibirCPF"} />
                            </Col>

                            <Col sm={3}>
                                <ExibirInputSimples label={"Data de nascimento"} data={formatarDataParaVisualizacao(paciente.dataNascimento)} controlId={"exibirDataNascimento"} />
                            </Col>
                        </Row>

                        {renderAlertaErro()}

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
                        <Button variant="outline-secondary" onClick={handleClose} className='me-5'>
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            variant="danger"
                            disabled={isLoading}
                            onClick={!isLoading ? handleClick : null}
                        >
                            {isLoading ? 'Excluindo...' : 'Excluir'}
                        </Button>


                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import ExibirInputSimples from '../../../components/ExibirInputSimples';
import React, { useState} from 'react';

import formatarDataParaVisualizacao from '../../../Functions/formatarDataParaVisualizacao';
import Paciente from '../../../../../models/Paciente';


export default function ModalVerMaisPaciente({ paciente }: { paciente: Paciente }) {

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ver mais informações
        </Tooltip>
    );

    return (
        <>
            <OverlayTrigger
                placement="left"
                delay={{ show: 400, hide: 250 }}
                overlay={renderTooltip}
            >
                <Button variant="outline-secondary" onClick={handleShow}>
                    <i className="bi bi-arrows-angle-expand"></i>

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
                    <Modal.Title>informação do paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Nome"} data={paciente.nome} controlId={"exibirNome"} />
                            </Col>

                            <Col sm={6}>
                                <ExibirInputSimples label={"CPF"} data={paciente.cpf} controlId={"exibirCPF"} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Nome social"} data={paciente.nomeSocial} controlId={"exibirNomeSocial"} />
                            </Col>

                            <Col sm={6}>
                                <ExibirInputSimples label={"Identidade de gêreno"} data={paciente.identidadeGenero} controlId={"exibirCPF"} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Data de Nascimento"} data={formatarDataParaVisualizacao(paciente.dataNascimento)} controlId={"exibirNascimento"} />
                            </Col>

                            <Col sm={6}>
                                <ExibirInputSimples label={"Telefone"} data={paciente.telefone} controlId={"exibirTelefone"} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Tipo de Paciente"} data={paciente.tipoPaciente} controlId={"exibirPaciente"} />
                            </Col>

                            <Col sm={6}>
                                <ExibirInputSimples label={"Como soube"} data={paciente.comoSoube} controlId={"exibirComoSoube"} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Sexo"} data={paciente.sexo} controlId={"exibirSexo"} />
                            </Col>

                            <Col sm={6}>
                                <ExibirInputSimples label={"Estado civil"} data={paciente.estadoCivil} controlId={"exibirEstadoCivil"} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Cidade"} data={paciente.cidade} controlId={"exibirCidade"} />
                            </Col>

                            <Col sm={6}>
                                <ExibirInputSimples label={"Bairro"} data={paciente.bairro} controlId={"exibirBairro"} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Endereço"} data={paciente.endereco} controlId={"exibirEndereco"} />
                            </Col>

                            <Col sm={6}>
                                <ExibirInputSimples label={"Complemento"} data={paciente.numero} controlId={"exibirNumero"} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Nível de escolaridade"} data={paciente.nivelEscolaridade} controlId={"exibirEscolaridade"} />
                            </Col>

                            <Col sm={6}>
                                <ExibirInputSimples label={"Profissão"} data={paciente.profissao} controlId={"exibirProfissao"} />
                            </Col>
                        </Row>

                        {/* <Row>
                            <Col>
                                <ExibirInputSimples label={"Como soube?"} data={paciente.comoSoube} controlId={"exibirComoSoube"} />
                            </Col>
                        </Row> */}
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <div className='mt-3 mb-3'>
                        <Button variant="outline-secondary" onClick={handleClose}>
                            Fechar
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
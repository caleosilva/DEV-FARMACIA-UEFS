import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import ExibirInputSimples from '../../../components/ExibirInputSimples';
import React, { useState, useEffect } from 'react';

import Doador from '../../../../../models/Doador';
import formatarDataParaVisualizacao from '../../../Functions/formatarDataParaVisualizacao'


export default function ModalVerMaisDoador({ doador }: { doador: Doador }) {

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => setShow(true);


    const handleClick = () => setLoading(true);
    const [isLoading, setLoading] = useState(false);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ver mais informações
        </Tooltip>
    );


    function renderInformacoesAdicionais() {
        if (doador.tipoDoador === "Pessoa física") {
            return (
                <>
                    <Row>
                        <Col sm={6}>
                            <ExibirInputSimples label={"CPF"} data={doador.cpf} controlId={"exibirCPF"} />
                        </Col>

                        <Col sm={6}>
                            <ExibirInputSimples label={"Data de nascimento"} data={formatarDataParaVisualizacao(doador.dataNascimento)} controlId={"exibirDataNascimento"} />
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={6}>
                            <ExibirInputSimples label={"Nome social"} data={doador.nomeSocial} controlId={"exibirNomeSocial"} />
                        </Col>

                        <Col sm={6}>
                            <ExibirInputSimples label={"Identidade de gêreno"} data={doador.identidadeGenero} controlId={"exibirCPF"} />
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={6}>
                            <ExibirInputSimples label={"Sexo"} data={doador.sexo} controlId={"exibirSexo"} />
                        </Col>

                        <Col sm={6}>
                            <ExibirInputSimples label={"Estado civil"} data={doador.estadoCivil} controlId={"exibirEstadoCivil"} />
                        </Col>
                    </Row>

                </>
            )
        } else if (doador.tipoDoador === "Pessoa jurídica") {
            return (
                <Row>
                    <Col sm={6}>
                        <ExibirInputSimples label={"CNPJ"} data={doador.cnpj} controlId={"exibirCnpj"} />
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
                    <Modal.Title>informação do doador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <ExibirInputSimples label={"Nome"} data={doador.nome} controlId={"exibirNome"} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Cidade"} data={doador.cidade} controlId={"exibirCidade"} />
                            </Col>

                            <Col sm={6}>
                                <ExibirInputSimples label={"Bairro"} data={doador.bairro} controlId={"exibirBairro"} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Endereço"} data={doador.endereco} controlId={"exibirEndereco"} />
                            </Col>

                            <Col sm={6}>
                                <ExibirInputSimples label={"Complemento"} data={doador.numero} controlId={"exibirNumero"} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <ExibirInputSimples label={"Como soube?"} data={doador.comoSoube} controlId={"exibirComoSoube"} />
                            </Col>

                            <Col sm={6}>
                                <ExibirInputSimples label={"Tipo do doador"} data={doador.tipoDoador} controlId={"exibirTipoDoador"} />
                            </Col>
                        </Row>

                        {renderInformacoesAdicionais()}
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <div className='mt-3 mb-3 d-flex justify-content-around'>
                        <Button variant="outline-secondary" onClick={handleClose}>
                            Fechar
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
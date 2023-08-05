import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';

import { serverFunctions } from '../../../../utils/serverFunctions';
import InputText from '../../../components/InputText';
import gerarHashCode from '../../../Functions/gerarHashCode';

import React, { useState, useEffect } from 'react';


export default function ModalAtualizarSenha({ cpf }: { cpf: string }) {

    // CRIAR OS USESTATE
    const [mensagem, setMensagem] = useState(false);
    const [senhaDiferente, setSenhaDiferente] = useState(false);
    const [senhaAnteriorIncorreta, setSenhaAnteriorIncorreta] = useState(false);

    const [show, setShow] = useState(false);

    const [senhaAnterior, setSenhaAnterior] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [confimarSenhaAtual, setConfirmarSenhaAtual] = useState('');


    const handleClose = () => {
        setSenhaAnterior('');
        setSenhaAtual('');
        setConfirmarSenhaAtual('');
        setShow(false);
    };

    // MUDAR PARA TEXTO
    function renderAlertaErro() {
        if (mensagem) {
            return (
                <Row>
                    <Col>
                        <p className="texto-fino textoVermelho noMaginPadin d-flex justify-content-center">
                            Não foi possível alterar a senha no momento!
                        </p>
                    </Col>
                </Row>
            )
        }
    }

    function renderErroSenhasDiferentes() {
        if (senhaDiferente) {
            return (
                <Row>
                    <Col>
                        <p className="texto-fino textoVermelho noMaginPadin d-flex justify-content-center">
                            As novas senhas são diferentes!
                        </p>

                    </Col>
                </Row>
            )
        }
    }

    function renderErroSenhasAnteriorIncorreta() {
        if (senhaAnteriorIncorreta) {
            return (
                <Row>
                    <Col>
                        <p className="texto-fino textoVermelho noMaginPadin d-flex justify-content-center">
                            A senha anterior está incorreta!
                        </p>

                    </Col>
                </Row>
            )
        }
    }


    const handleShow = () => setShow(true);

    const handleClick = () => setLoading(true);
    const [isLoading, setLoading] = useState(false);

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if (senhaAnterior !== '' && senhaAtual !== '' && confimarSenhaAtual !== '' ) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [senhaAnterior, senhaAtual, confimarSenhaAtual]);

    useEffect(() => {

        if (isLoading) {

            setSenhaDiferente(false);
            setSenhaAnteriorIncorreta(false);
            setMensagem(false);

            if (senhaAtual !== confimarSenhaAtual) {
                setSenhaDiferente(true);
                setLoading(false);
            } else {
                const dados = {
                    cpf,
                    hashSenha: gerarHashCode(senhaAnterior),
                    hashNovaSenha: gerarHashCode(senhaAtual)
                }

                serverFunctions.alterarSenha(dados).then((sucesso) => {
                    if (sucesso) {

                        // Limpa os formulários:
                        setSenhaAnterior('');
                        setSenhaAtual('');
                        setConfirmarSenhaAtual('');

                        setLoading(false);
                        setMensagem(false);
                        handleClose();
                    } else {
                        setLoading(false);
                        setSenhaAnteriorIncorreta(true);
                    }
                }).catch(
                    (e) => {
                        console.log(e.stack);
                        setMensagem(true);
                        setLoading(false);
                    });
            }
        }
    }, [isLoading]);

    return (

        <>

            <Button variant="outline-dark" onClick={handleShow}>
                Alterar senha
            </Button>

            <Modal
                dialogClassName='modal-dialog-scrollable'
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}

                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Header closeButton>
                    <Modal.Title>Alterar senha</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <InputText required={true} type={"password"} placeholder='' name={"senhaAnterior"} label={"Senha anterior"} controlId={"inputSenhaAnterior"} data={senhaAnterior} setData={setSenhaAnterior} />
                            </Col>
                        </Row>

                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <InputText required={true} type={"password"} placeholder='' name={"senhaAtual"} label={"Nova senha"} controlId={"inputnovaSenha"} data={senhaAtual} setData={setSenhaAtual} />
                            </Col>
                        </Row>

                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <InputText required={true} type={"password"} placeholder='' name={"senhaAtualConfirmar"} label={"Nova senha"} controlId={"senhaAtualConfirmar"} data={confimarSenhaAtual} setData={setConfirmarSenhaAtual} />
                            </Col>
                        </Row>

                        {renderErroSenhasDiferentes()}

                        {renderErroSenhasAnteriorIncorreta()}

                        {renderAlertaErro()}

                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Container className='mt-3 mb-3' style={{ width: '100%' }}>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <Button variant="outline-secondary" onClick={handleClose} className=''>
                                    Cancelar
                                </Button>
                            </Col>

                            <Col className='d-flex justify-content-center'>
                                <Button
                                    type="submit"
                                    variant="danger"
                                    disabled={isLoading || !isFormValid}
                                    onClick={!isLoading ? handleClick : null}
                                >
                                    {isLoading ? 'Alterando...' : 'Alterar'}
                                </Button>
                            </Col>
                        </Row>



                    </Container>
                </Modal.Footer>
            </Modal>
        </>
    );
}
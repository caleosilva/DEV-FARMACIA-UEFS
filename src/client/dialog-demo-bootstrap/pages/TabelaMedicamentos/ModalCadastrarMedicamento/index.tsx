// import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { Form } from 'react-bootstrap';

import InputText from '../../../components/InputText';
import InputSelect from '../../../components/InputSelect';
import { serverFunctions } from '../../../../utils/serverFunctions';
import MedicamentoGeral from '../../../../../models/MedicamentoGeral';
import dataHojeFormatada from '../../../Functions/dataHojeFormatada';
import gerarHashCode from '../../../Functions/gerarHashCode';

import React, { useEffect, useContext } from 'react';
import { useState, useRef } from 'react';
import UserContext from '../../../contexts/user/context';


function MedModalCadastrar({ data, setData, listaDD }: { data: Array<MedicamentoGeral>, setData: Function, listaDD: string[][] }) {

    const { setState, state } = useContext(UserContext);

    // Controle ao clicar em cadastrar
    const handleClick = () => {
        setControleIncompleto(true);
        setLoading(true)
    };
    const [isLoading, setLoading] = useState(false);

    // Mensagem de erro:
    const [mensagem, setMensagem] = useState(false);
    const [avisoIncompleto, setAvisoIncompleto] = useState(false);
    const [controleImcopleto, setControleIncompleto] = useState(false);
    const [mensagemErroBack, setMensagemErroBack] = useState(false);


    // Carrega os dados do DropDown
    const [lista, setLista] = useState([[]]);

    // Elementos do formulário:
    const [classe, setClasse] = useState(''); //-----------------SELECT
    const [tarja, setTarja] = useState(''); //-------------------SELECT
    const [apresentacao, setApresentacao] = useState(''); //-----SELECT
    const [nome, setNome] = useState('');
    const [principioAtivo, setPrincipioAtivo] = useState('');

    // Cuida de abrir e fechar o modal:

    const handleClose = () => {
        setNome('');
        setPrincipioAtivo('');
        setClasse('');
        setTarja('');
        setApresentacao('');

        setShow(false);
        setAvisoIncompleto(false);
    };
    const handleShow = () => setShow(true);

    const [show, setShow] = useState(false);

    function renderAlertaExistente() {
        if (mensagem) {
            return (
                <Row>
                    <Col className='mb-3 mt-2'>
                        <Alert variant="danger" onClose={() => setMensagem(false)} dismissible>
                            <Alert.Heading>Não foi possível realizar o cadastro</Alert.Heading>
                            <p>
                                Já existe um medicamento cadastrado com o nome e o princípio ativo inserido.
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    function renderAlertaErroBack() {
        if (mensagemErroBack) {
            return (
                <Row >
                    <Col className='mb-3 mt-3'>
                        <Alert variant="dark" onClose={() => setMensagemErroBack(false)} dismissible>
                            <Alert.Heading>Erro!</Alert.Heading>
                            <p>
                                Não foi possível cadastrar o medicamento, tente novamente mais tarde!
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    function renderDadosIncompletos() {
        if (avisoIncompleto) {
            return (
                <Row>
                    <Col className='mb-3 mt-2'>
                        <Alert variant="info" onClose={() => setAvisoIncompleto(false)} dismissible>
                            <Alert.Heading>Atenção</Alert.Heading>
                            <p>
                                Preencha corretamente todos os campos que possuem o indicativo * para concluir o cadastro.
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if (classe != '' && tarja != '' && apresentacao != '' && nome != '' && principioAtivo != '') {
            setIsFormValid(true);
            setAvisoIncompleto(false);
        } else {
            setIsFormValid(false);
        }
    }, [classe, tarja, apresentacao, nome, principioAtivo]);

    // Realiza o cadastro
    useEffect(() => {

        if (isFormValid) {
            const dataCadastro = dataHojeFormatada();

            const chaveGeralStr = (nome + '#' + principioAtivo + '#' + apresentacao).toString().toLowerCase().replace(/\s+/g, '');
            const chaveGeral = gerarHashCode(chaveGeralStr);

            const quantidadeTotal = 0;
            const validadeMaisProxima = "-";

            var chaveUsuario;
            if (state.chaveUsuario) {
                chaveUsuario = state.chaveUsuario
            }


            const medicamentoGeral = {
                chaveGeral, dataCadastro, nome, principioAtivo, tarja, classe, apresentacao, quantidadeTotal, validadeMaisProxima, chaveUsuario
            }

            if (isLoading) {
                serverFunctions.appendRowMedicamentos(medicamentoGeral).then((sucesso) => {
                    if (sucesso) {
                        // Atualiza a tabela:
                        setData([...data, medicamentoGeral])

                        // Limpa os formulários
                        setNome('');
                        setPrincipioAtivo('');
                        setClasse('');
                        setTarja('');
                        setApresentacao('');

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
        } else {
            if (controleImcopleto) {
                setAvisoIncompleto(true);
            }
            setLoading(false);
        }
    }, [isLoading]);

    // Carrega as informações do dropdown
    useEffect(() => {
        setLista(listaDD)
    }, [listaDD]);

    return (
        <>
            <Button variant="outline-secondary" onClick={handleShow}>
                Cadastrar medicamento
            </Button>

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
                    <Modal.Title>Cadastro de medicamento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Container>
                            <Row>
                                <Col>
                                    <InputText type={"text"} required={true} label={"Nome do medicamento*"} placeholder={""} controlId={"inputNomeMed"} name={"nome"} data={nome} setData={setNome} />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <InputText type={"text"} required={true} label={"Princípio ativo*"} placeholder={""} controlId={"inputPrincMed"} name={"principioAtivo"} data={principioAtivo} setData={setPrincipioAtivo} />
                                </Col>
                            </Row>

                            <Row className='mb-3'>

                                <Col>
                                    <InputSelect required={true} label={"Classe*"} name={"classe"} data={classe} setData={setClasse} lista={lista ? lista[0] : []} />
                                </Col>
                            </Row>

                            <Row className='mb-3'>
                                <Col sm={6}>
                                    <InputSelect required={true} label={"Tarja*"} name={"tarja"} data={tarja} setData={setTarja} lista={lista ? lista[2] : []} />
                                </Col>

                                <Col sm={6}>
                                    <InputSelect required={true} label={"Apresentação*"} name={"apresentacao"} data={apresentacao} setData={setApresentacao} lista={lista ? lista[3] : []} />
                                </Col>
                            </Row>

                            {renderAlertaExistente()}

                            {renderAlertaErroBack()}


                        </Container>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    {renderDadosIncompletos()}

                    <div className='mt-3 mb-3'>
                        <Button variant="outline-secondary" onClick={handleClose} className='me-5'>
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            variant="dark"
                            disabled={isLoading}
                            onClick={!isLoading ? handleClick : null}
                        >
                            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MedModalCadastrar;

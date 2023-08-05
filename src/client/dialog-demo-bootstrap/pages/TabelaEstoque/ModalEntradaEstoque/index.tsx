import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';

import React, { useState, useEffect, useContext } from 'react';

import InputPositiveNumber from '../../../components/InputPositiveNumber';
import { serverFunctions } from '../../../../utils/serverFunctions';
import InputSelect from '../../../components/InputSelect';
import InputReactSelect from '../../../components/InputReactSelect';
import MedicamentoEspecifico from '../../../../../models/MedicamentoEspecifico';
import Doador from '../../../../../models/Doador';
import formatarDataParaVisualizacao from '../../../Functions/formatarDataParaVisualizacao';
import dataHojeFormatada from '../../../Functions/dataHojeFormatada';
import UserContext from '../../../contexts/user/context';


export default function ModalEntradaEstoque({ remedio, listaDD, data, setData }: { remedio: MedicamentoEspecifico, listaDD: string[][], data: Array<MedicamentoEspecifico>, setData: Function }) {

    // Dados de quem tá logado.
    const { setState, state } = useContext(UserContext);


    const [quantidade, setQuantidade] = useState('');

    const [dataDoadores, setDataDoadores] = useState(null);
    const [doador, setDoador] = useState(null);

    const [opcaoEntrada, setOpcaoEntrada] = useState('');
    const [lista, setLista] = useState([[]]);

    const [mensagemErroBack, setMensagemErroBack] = useState(false);
    const [mensagem, setMensagem] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => {
        // setDoador('');
        setOpcaoEntrada('');
        setQuantidade('');

        setDoador(null);
        setShow(false);

        setMensagem(false);
        setMensagemErroBack(false);
    };
    const handleShow = () => setShow(true);


    const handleClick = () => setLoading(true);
    const [isLoading, setLoading] = useState(false);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Registrar entrada
        </Tooltip>
    );

    const gerarLabel = (event) => {
        var label;
        if (event.tipoDoador === "Pessoa física") {
            label = `${event.nome}, ${formatarDataParaVisualizacao(event.dataNascimento)}`;
            return label;
        } else if (event.tipoDoador === "Pessoa jurídica") {
            label = `${event.nome}, ${event.cnpj}`;
            return label;
        } else {
            label = `${event.nome}`;
            return label;
        }
    }

    function renderSelectDoador() {
        if (opcaoEntrada == 'Doação') {
            var listaDoadorGeral = [{}];
            if (dataDoadores != null && dataDoadores) {
                dataDoadores.map((event: Doador, index) => (
                    listaDoadorGeral.push({ value: event, label: gerarLabel(event) })
                ))
            }

            return (
                <Col SM={7}>
                    <InputReactSelect label={"Selecione o doador"} lista={listaDoadorGeral} data={doador} setData={setDoador} />
                </Col>
            )
        }
    }

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if (quantidade != '' && opcaoEntrada === "Doação" && doador != null && Object.keys(doador).length > 0) {
            setIsFormValid(true);
        } else if (quantidade != '' && opcaoEntrada != 'Doação' && opcaoEntrada != '') {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [quantidade, opcaoEntrada, doador]);

    useEffect(() => {

        if (isLoading) {

            // const dataOperacao = dataHojeFormatada();
            const dataOperacao = new Date().toString();

            const novaQuantidade = remedio.quantidade + parseInt(quantidade);
            var chaveDoador = '-';

            if (doador != null) {
                chaveDoador = doador.value.chaveDoador;
            }

            const dadosEstoque = {
                dataOperacao,
                quantidadeAnterior: remedio.quantidade,
                novaQuantidade,
                motivo: opcaoEntrada,
                chaveMedicamentoEspecifico: remedio.chaveMedicamentoEspecifico,
                chaveMedicamentoGeral: remedio.chaveMedicamentoGeral,
                chaveDoador,
                chavePaciente: "-",
                chaveUsuario: state.chaveUsuario
            }

            serverFunctions.atualizarQuantidadeEstoque(remedio, quantidade, true, dadosEstoque).then((sucesso) => {
                if (sucesso) {
                    // Atualiza a tabela:
                    remedio.quantidade = novaQuantidade;
                    setData([...data]);

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

    useEffect(() => {
        setLista(listaDD)
    }, [listaDD]);

    useEffect(() => {
        serverFunctions.getDoadores().then(string => { setDataDoadores(JSON.parse(string)) }).catch(alert);
    }, []);

    return (

        <>
            <OverlayTrigger
                placement="left"
                delay={{ show: 400, hide: 250 }}
                overlay={renderTooltip}
            >
                <Button variant="outline-secondary" onClick={handleShow}>
                    <i className="bi bi-plus-circle"></i>
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
                    <Modal.Title>Entrada de estoque</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>

                        <Row className=''>
                            <Col sm={5}>
                                <Alert key="success" variant="success">
                                    <p>Em estoque: <strong>{remedio.quantidade}</strong></p>
                                </Alert>
                            </Col>


                        </Row>

                        <Row className=''>
                            <Col sm={5}>
                                <InputPositiveNumber required={true} label={"Quantidade a ser adicionada"} placeholder={""} controlId={"inputQuantidade"} name={"quantidade"} data={quantidade} setData={setQuantidade} max={9999} />
                            </Col>
                        </Row>

                        <Row className='mb-3'>
                            <Col sm={5}>
                                <InputSelect required={true} label={"Opção de entrada"} name={"opcEntrada"} data={opcaoEntrada} setData={setOpcaoEntrada} lista={lista ? lista[10] : []} />
                            </Col>

                            {renderSelectDoador()}
                        </Row>

                        <Row className='mb-3 mt-2'>
                            {mensagem &&
                                <Col>
                                    <Alert variant="danger" onClose={() => setMensagem(false)} dismissible>
                                        <Alert.Heading>Não foi possível adicionar</Alert.Heading>
                                        <p>
                                            Tente novamente mais tarde.
                                        </p>
                                    </Alert>
                                </Col>
                            }
                        </Row>

                        <Row className='mb-3 mt-3'>
                            {mensagemErroBack &&
                                <Col>
                                    <Alert variant="dark" onClose={() => setMensagemErroBack(false)} dismissible>
                                        <Alert.Heading>Erro!</Alert.Heading>
                                        <p>
                                            Não foi possível registrar a entrada, tente novamente mais tarde!
                                        </p>
                                    </Alert>
                                </Col>
                            }
                        </Row>

                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <div className=''>
                        <Button variant="outline-secondary" onClick={handleClose} className='me-5'>
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            variant="dark"
                            disabled={isLoading || !isFormValid}
                            onClick={!isLoading ? handleClick : null}
                        >
                            {isLoading ? 'Confirmando...' : 'Confirmar'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
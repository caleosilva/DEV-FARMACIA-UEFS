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
import InputText from '../../../components/InputText';
import InputSelect from '../../../components/InputSelect';
import { serverFunctions } from '../../../../utils/serverFunctions';
import MedicamentoEspecifico from '../../../../../models/MedicamentoEspecifico';
import InputReactSelect from '../../../components/InputReactSelect';
import Paciente from '../../../../../models/Paciente';
import formatarDataParaVisualizacao from '../../../Functions/formatarDataParaVisualizacao';
import dataHojeFormatada from '../../../Functions/dataHojeFormatada';
import UserContext from '../../../contexts/user/context';


export default function ModalSaidaEstoque({ remedio, listaDD, data, setData }: { remedio: MedicamentoEspecifico, listaDD: string[][], data: Array<MedicamentoEspecifico>, setData: Function }) {

    // Dados de quem tá logado.
    const { setState, state } = useContext(UserContext);

    const [quantidade, setQuantidade] = useState('');

    const [dataPaciente, setDataPaciente] = useState(null);
    const [paciente, setPaciente] = useState(null);

    const [opcaoSaida, setOpcaoSaida] = useState('');
    const [lista, setLista] = useState([[]]);

    const [mensagem, setMensagem] = useState(false);
    const [mensagemErroBack, setMensagemErroBack] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setPaciente(null);
        setOpcaoSaida('');
        setQuantidade('');
        setShow(false);
    };
    const handleShow = () => setShow(true);


    const handleClick = () => setLoading(true);
    const [isLoading, setLoading] = useState(false);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Registrar saída
        </Tooltip>
    );

    function renderSelectPaciente() {
        if (opcaoSaida === 'Paciente') {
            var listaPacienteGeral = [{}];

            if (dataPaciente != null && dataPaciente) {
                dataPaciente.map((event: Paciente, index) => (
                    listaPacienteGeral.push({ value: event, label: `${event.nome}, ${formatarDataParaVisualizacao(event.dataNascimento)}` })
                ))
            }

            return (
                <Col SM={7}>
                    <InputReactSelect label={"Selecione o paciente"} lista={listaPacienteGeral} data={paciente} setData={setPaciente} />
                </Col>
            )
        }
    }

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if (quantidade != '' && opcaoSaida === "Paciente" && paciente != '' && paciente != null && Object.keys(paciente).length > 0) {
            setIsFormValid(true);
        } else if (quantidade != '' && opcaoSaida != 'Paciente' && opcaoSaida != '') {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [quantidade, opcaoSaida, paciente]);

    useEffect(() => {

        var novaQuantidade = 0;
        if (typeof remedio.quantidade === 'string') {
            novaQuantidade = parseInt(remedio.quantidade) - parseInt(quantidade);
        } else {
            novaQuantidade = remedio.quantidade - parseInt(quantidade);
        }

        // Nunca vai cair aqui, massssss..
        if (novaQuantidade < 0) novaQuantidade = 0;

        // var novaQuantidade = remedio.quantidade - parseInt(quantidade);
        var chavePaciente = '-';
        if (paciente != null && paciente != undefined){
            chavePaciente = paciente.value.chavePaciente;
        }
        
        const dataOperacao = new Date().toString();
        var dadosEstoque = {
            dataOperacao,
            quantidadeAnterior: remedio.quantidade,
            novaQuantidade,
            motivo: opcaoSaida,
            chaveMedicamentoEspecifico: remedio.chaveMedicamentoEspecifico,
            chaveMedicamentoGeral: remedio.chaveMedicamentoGeral,
            chaveDoador: "-",
            chavePaciente,
            chaveUsuario: state.chaveUsuario
        }

        if (isLoading) {
            serverFunctions.atualizarQuantidadeEstoque(remedio, quantidade, false, dadosEstoque).then((sucesso) => {
                if (sucesso) {
                    // Atualiza a tabela:
                    remedio.quantidade = remedio.quantidade - parseInt(quantidade);
                    setData([...data]);

                    setLoading(false);
                    setMensagem(false);
                    setPaciente(null);
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
        serverFunctions.getPacientes().then(string => { setDataPaciente(JSON.parse(string)) }).catch(alert);
    }, []);

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
                    <Modal.Title>Saída de estoque</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className=''>
                            <Col sm={5}>
                                <Alert key="warning" variant="warning">
                                    <p>Em estoque: <strong>{remedio.quantidade}</strong></p>
                                </Alert>
                            </Col>
                        </Row>

                        <Row className=''>
                            <Col sm={5}>
                                <InputPositiveNumber required={true} label={"Quantidade a ser retirada"} placeholder={""} controlId={"inputQuantidade"} name={"quantidade"} data={quantidade} setData={setQuantidade} max={remedio.quantidade} />
                            </Col>
                        </Row>

                        <Row className='mb-3 '>
                            <Col sm={5}>
                                <InputSelect required={true} label={"Opção de saída"} name={"opcSaida"} data={opcaoSaida} setData={setOpcaoSaida} lista={lista ? lista[11] : []} />
                            </Col>

                            {renderSelectPaciente()}
                        </Row>

                        <Row className='mb-3 mt-2'>
                            {mensagem &&
                                <Col>
                                    <Alert variant="danger" onClose={() => setMensagem(false)} dismissible>
                                        <Alert.Heading>Não foi possível retirar</Alert.Heading>
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
                                            Não foi possível completar a retirada, tente novamente mais tarde!
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
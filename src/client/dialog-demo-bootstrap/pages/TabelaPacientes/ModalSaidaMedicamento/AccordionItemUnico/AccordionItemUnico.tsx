import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { useState, useEffect, useContext } from 'react';
import React from 'react';

import { serverFunctions } from '../../../../../utils/serverFunctions';
import MedicamentoEspecifico from '../../../../../../models/MedicamentoEspecifico';
import MedicamentoGeral from '../../../../../../models/MedicamentoGeral';
import InputSelectMedGeral from '../InputSelectMedGeral/InputSelectMedGeral';
import formatarDataParaVisualizacao from '../../../../Functions/formatarDataParaVisualizacao';
import dataHojeFormatada from '../../../../Functions/dataHojeFormatada';
import './AccordionItemUnico.css';
import InputPositiveNumber from '../../../../components/InputPositiveNumber';
import Paciente from '../../../../../../models/Paciente';
import ExibirInputSimples from '../../../../components/ExibirInputSimples';
import UserContext from '../../../../contexts/user/context';



export default function AccordionitemUnico({ eventKey, paciente, dataMedicamentoGeral, setDataMedicamentoGeral, quantidadePreenchida, setQuantidadePreenchida }: { eventKey: string, paciente: Paciente, dataMedicamentoGeral: any, setDataMedicamentoGeral: Function, quantidadePreenchida: number, setQuantidadePreenchida: Function }) {

    // Dados de quem tá logado.
    const { setState, state } = useContext(UserContext);

    // const [dataMedicamentoGeral, setDataMedicamentoGeral] = useState(null);
    const [objMedicamentoGeral, setObjMedicamentoGeral] = useState(null);

    const [dataMedicamentoEspecifico, setDataMedicamentoEspecifico] = useState(null);
    const [objMedicamentoEspecifico, setObjMedicamentoEspecifico] = useState(null);

    const [quantidade, setQuantidade] = useState('');
    const [valorMaximo, setValorMaximo] = useState(0);

    const [sucesso, setSucesso] = useState(false);


    const [mensagem, setMensagem] = useState(false);
    const [mensagemErroBack, setMensagemErroBack] = useState(false);


    // Controle ao clicar em cadastrar
    const handleClick = () => setLoading(true);
    const [isLoading, setLoading] = useState(false);

    function handleSomar() {
        setQuantidadePreenchida(quantidadePreenchida + 1);
    }

    const handleLimpar = () => {
        setObjMedicamentoGeral(null);
        setDataMedicamentoEspecifico(null);
        setObjMedicamentoEspecifico(null);
        setQuantidade('');
        setValorMaximo(0);
    };

    function renderWarningDadosExistentes() {
        if (mensagem) {
            return (
                <Row className='mb-3 mt-3'>
                    <Col>
                        <Alert variant="danger" onClose={() => setMensagem(false)} dismissible>
                            <Alert.Heading>Erro!</Alert.Heading>
                            <p>
                                Não foi possível registrar a saída, tente novamente. Caso o erro persista, comunique o administrador.
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )

        }
    }

    function renderWarningBackError() {
        if (mensagemErroBack) {
            return (
                <Row className='mb-3 mt-3'>
                    <Col>
                        <Alert variant="dark" onClose={() => setMensagemErroBack(false)} dismissible>
                            <Alert.Heading>Erro!</Alert.Heading>
                            <p>
                                Não foi possível lançar a saída. Tente novamente mais tarde!
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )

        }
    }

    function visualizarBody() {
        if (sucesso) {
            return (
                <Container>
                    <Row>
                        <Col>
                            <ExibirInputSimples label={"Medicamento"} data={objMedicamentoGeral.label} controlId={"exibirGeral"} />
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={9}>
                            <ExibirInputSimples label={"Medicamento selecionado"} data={objMedicamentoEspecifico.label} controlId={"exibirEsp"} />
                        </Col>

                        <Col sm={3}>
                            <ExibirInputSimples label={"Quantidade"} data={quantidade} controlId={"exibirQuantidade"} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Alert variant="success">
                                <Alert.Heading>Sucesso</Alert.Heading>
                                <p>
                                    A saída do medicamento para o paciente foi realizada com sucesso.
                                </p>
                            </Alert>
                        </Col>
                    </Row>


                </Container>
            )
        } else {
            return (
                <Container>
                    <Row className='mb-3'>
                        <Col>
                            {renderBuscarOpcoesMedGeral()}
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={9}>
                            {renderBuscarOpcoesMedEspecifico()}
                        </Col>

                        <Col sm={3}>
                            <InputPositiveNumber label={"Quantidade a sair"} placeholder='' controlId='inputQuantidade' name='inputNumber' data={quantidade} setData={setQuantidade} required={true} max={valorMaximo} />
                        </Col>
                    </Row>

                    {renderWarningBackError()}

                    {renderWarningDadosExistentes()}

                    <Row>
                        <Col className='d-flex justify-content-center mt-3'>
                            <Button variant="outline-secondary" className='me-5' onClick={handleLimpar}>
                                Limpar
                            </Button>

                            <Button
                                type="submit"
                                variant="dark"
                                disabled={isLoading || !isFormValid}
                                onClick={!isLoading ? handleClick : null}
                            >
                                {isLoading ? 'Confirmando...' : 'Confirmar'}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }

    function renderBuscarOpcoesMedGeral() {
        var listaMedicamentoGeral = [{}];

        if (dataMedicamentoGeral != null && Object.keys(dataMedicamentoGeral).length > 0) {
            dataMedicamentoGeral.map((event: MedicamentoGeral, index) => (
                listaMedicamentoGeral.push({ value: event, label: `${event.nome}, ${event.principioAtivo}, ${event.apresentacao}. Em estoque: ${event.quantidadeTotal}` })
            ))
        }
        return (
            <InputSelectMedGeral label={"Selecione o medicamento"} lista={listaMedicamentoGeral} data={objMedicamentoGeral} setData={setObjMedicamentoGeral} />
        )
    }

    function renderBuscarOpcoesMedEspecifico() {
        var listaMedicamentoEspecifico = [{}];

        if (dataMedicamentoEspecifico != null) {
            if (Object.keys(dataMedicamentoEspecifico).length > 0) {
                dataMedicamentoEspecifico.map((event: MedicamentoEspecifico, index) => {
                    listaMedicamentoEspecifico.push({ value: event, label: `Quantidade: ${event.quantidade} | Lote: ${event.lote} | Dosagem: ${event.dosagem} | Validade: ${formatarDataParaVisualizacao(event.validade)}.` });
                })
            }
        }
        return (
            <InputSelectMedGeral label={"Selecione o medicamento a ser retirado"} lista={listaMedicamentoEspecifico} data={objMedicamentoEspecifico} setData={setObjMedicamentoEspecifico} />
        )
    }

    useEffect(() => {
        // const dataOperacao = dataHojeFormatada();
        const dataOperacao = new Date().toString();


        var dados;
        if (objMedicamentoEspecifico != null) {
            var novaQuantidade = parseInt(objMedicamentoEspecifico.value.quantidade) - parseInt(quantidade);
            
            // Nunca vai cair aqui, massssss..
            if (novaQuantidade < 0) novaQuantidade = 0;

            dados = {
                dataOperacao,
                quantidadeAnterior: objMedicamentoEspecifico.value.quantidade,
                novaQuantidade,
                motivo: "Paciente",
                chaveMedicamentoEspecifico: objMedicamentoEspecifico.value.chaveMedicamentoEspecifico,
                chaveMedicamentoGeral: objMedicamentoGeral.value.chaveGeral,
                chaveDoador: '-',
                chavePaciente: paciente.chavePaciente,
                chaveUsuario: state.chaveUsuario, //PEGAR ISSO DE QUEM TÁ LOGADO
                quantidade,
            }
        }

        if (isLoading) {
            // no back, atualizar a quantidade tanto no estoque quanto na geral.

            serverFunctions.saidaPorPaciente(dados).then((sucesso) => {
                if (sucesso) {
                    handleSomar();
                    setSucesso(true);
                    setDataMedicamentoGeral(null);
                    setLoading(false);
                    setMensagem(false);
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

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if (objMedicamentoGeral != null && objMedicamentoEspecifico != null && parseInt(quantidade) > 0) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [objMedicamentoGeral, objMedicamentoEspecifico, quantidade]);

    useEffect(() => {
        setDataMedicamentoEspecifico(null);

        if (objMedicamentoGeral != null && Object.keys(objMedicamentoGeral).length != 0) {
            serverFunctions.getMedEspecificoChaveMedGeral(objMedicamentoGeral.value.chaveGeral).then(dados => { setDataMedicamentoEspecifico(JSON.parse(dados)) }).catch(alert);
        }
    }, [objMedicamentoGeral]);

    useEffect(() => {
        if (objMedicamentoEspecifico != null && Object.keys(objMedicamentoEspecifico).length != 0) {
            var quantidaUnica = parseInt(objMedicamentoEspecifico.value.quantidade);
            setValorMaximo(quantidaUnica)

        } else {
            setValorMaximo(0);
        }
    }, [objMedicamentoEspecifico]);

    return (
        <Accordion.Item eventKey={eventKey} className='corDeFundo'>
            <Accordion.Header>Registrar saída do {eventKey}º medicamento</Accordion.Header>
            <Accordion.Body>
                {visualizarBody()}
            </Accordion.Body>
        </Accordion.Item>
    )
}
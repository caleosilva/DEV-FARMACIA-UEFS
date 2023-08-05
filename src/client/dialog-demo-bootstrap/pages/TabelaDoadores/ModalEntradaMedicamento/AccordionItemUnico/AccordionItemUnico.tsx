import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { useState, useEffect, useContext } from 'react';
import React from 'react';

import { serverFunctions } from '../../../../../utils/serverFunctions';
import MedicamentoGeral from '../../../../../../models/MedicamentoGeral';
import InputSelectMedGeral from '../InputSelectMedGeral/InputSelectMedGeral';
import formatarDataParaVisualizacao from '../../../../Functions/formatarDataParaVisualizacao';
import dataHojeFormatada from '../../../../Functions/dataHojeFormatada';
import './AccordionItemUnico.css';
import InputPositiveNumber from '../../../../components/InputPositiveNumber';
import Doador from '../../../../../../models/Doador';
import InputText from '../../../../components/InputText';
import InputSelect from '../../../../components/InputSelect';
import formatarData from '../../../../Functions/formatarData';
import UserContext from '../../../../contexts/user/context';
import ExibirInputSimples from '../../../../components/ExibirInputSimples';


export default function AccordionitemUnico({ eventKey, doador, dataMedicamentoGeral, setDataMedicamentoGeral, lista, quantidadePreenchida, setQuantidadePreenchida }: { eventKey: string, doador: Doador, dataMedicamentoGeral: any, setDataMedicamentoGeral: Function, lista: string[][], quantidadePreenchida: number, setQuantidadePreenchida: Function }) {

    const [objMedicamentoGeral, setObjMedicamentoGeral] = useState(null);

    // Dados de quem tá logado.
    const { setState, state } = useContext(UserContext);

    // Elementos do formulário:
    const [lote, setLote] = useState('');
    const [dosagem, setDosagem] = useState('');
    const [validade, setValidade] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [origem, setOrigem] = useState('');
    const [tipo, setTipo] = useState('');
    const [fabricante, setFabricante] = useState('');
    const [motivoDoacao, setMotivoDoacao] = useState('');

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
        // setObjMedicamentoEspecifico(null);

        setLote('')
        setDosagem('')
        setValidade('')
        setQuantidade('')
        setOrigem('')
        setTipo('')
        setFabricante('')
        setMotivoDoacao('')
    };

    function renderErroExistente() {
        if (mensagem) {
            return (
                <Row className='mb-3 mt-2'>
                    <Col>
                        <Alert variant="danger" onClose={() => setMensagem(false)} dismissible>
                            <Alert.Heading>Não foi possível realizar o cadastro</Alert.Heading>
                            <p>
                                Já existe um medicamento cadastrado com a dosagem, lote e validade inserida.
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    function renderErroBack() {
        if (mensagemErroBack) {
            return (
                <Row className='mb-3 mt-3'>
                    <Col>
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

    function renderInputInformacoes() {
        return (
            <>

                <Row>
                    <Col>
                        <InputText type={"text"} required={true} label={"Dosagem"} placeholder={""} controlId={"inputDosagem"} name={"dosagem"} data={dosagem} setData={setDosagem} />
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}>
                        <InputText type={"text"} required={true} label={"Lote"} placeholder={""} controlId={"inputLote"} name={"lote"} data={lote} setData={setLote} />
                    </Col>

                    <Col sm={6}>
                        <InputText type={"date"} required={true} label={"Validade"} placeholder={""} controlId={"inputValidade"} name={"validade"} data={validade} setData={setValidade} />
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}>
                        <InputPositiveNumber required={true} label={"Quantidade"} placeholder={""} controlId={"inputQuantidade"} name={"quantidade"} data={quantidade} setData={setQuantidade} max={9999} />
                    </Col>

                    <Col sm={6}>
                        <InputText type={"text"} required={true} label={"Fabricante"} placeholder={""} controlId={"inputFabricante"} name={"fabricante"} data={fabricante} setData={setFabricante} />
                    </Col>
                </Row>

                <Row className='mb-3'>

                    <Col >
                        <InputSelect required={true} label={"Motivo da doação"} name={"motivoDoacao"} data={motivoDoacao} setData={setMotivoDoacao} lista={lista ? lista[4] : []} />
                    </Col>
                </Row>

                <Row className='mb-3'>
                    <Col sm={6}>
                        <InputSelect required={true} label={"Tipo"} name={"tipo"} data={tipo} setData={setTipo} lista={lista ? lista[1] : []} />
                    </Col>



                    <Col sm={6}>
                        <InputSelect required={true} label={"Origem"} name={"origem"} data={origem} setData={setOrigem} lista={lista ? lista[5] : []} />
                    </Col>
                </Row>
            </>
        )
    }

    function renderInformacoesPosCadastro() {
        const dataEntradaFormatada = dataHojeFormatada();
        const labelMedicamento = `${objMedicamentoGeral.value.nome}, ${objMedicamentoGeral.value.principioAtivo}, ${objMedicamentoGeral.value.apresentacao}`;
        return (
            <Container>
                <Row>
                    <Col>
                        <ExibirInputSimples label={"Medicamento selecionado"} data={labelMedicamento} controlId={"exibirMedicamento"} />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <ExibirInputSimples label={"Dosagem"} data={dosagem} controlId={"exibirDosagem"} />
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}>
                        <ExibirInputSimples label={"Lote"} data={lote} controlId={"exibirLote"} />
                    </Col>

                    <Col sm={6}>
                        <ExibirInputSimples label={"Validade"} data={formatarDataParaVisualizacao(validade)} controlId={"exibirValidade"} />
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}>
                        <ExibirInputSimples label={"Quantidade"} data={quantidade} controlId={"exibirQuantidade"} />
                    </Col>

                    <Col sm={6}>
                        <ExibirInputSimples label={"Fabricante"} data={fabricante} controlId={"exibirFabricante"} />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <ExibirInputSimples label={"Motivo da doação"} data={motivoDoacao} controlId={"exibirMotivo"} />
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}>
                        <ExibirInputSimples label={"Tipo"} data={tipo} controlId={"exibirTipo"} />
                    </Col>

                    <Col sm={6}>
                        <ExibirInputSimples label={"Origem do medicamento"} data={origem} controlId={"exibirOrigem"} />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Alert variant="success">
                            <Alert.Heading>Sucesso</Alert.Heading>
                            <p>
                                A doação foi cadastrada no sistema.
                            </p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        )
    }

    function visualizarBody() {
        if (sucesso) {
            return (
                <>
                    {renderInformacoesPosCadastro()}
                </>
            )
        } else {
            return (
                <Container>
                    <Row className='mb-3'>
                        <Col>
                            {renderBuscarOpcoesMedGeral()}
                        </Col>
                    </Row>

                    {renderInputInformacoes()}

                    {renderErroExistente()}

                    {renderErroBack()}

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
                listaMedicamentoGeral.push({ value: event, label: `${event.nome} | Princípio ativo: ${event.principioAtivo} | ${event.apresentacao}.` })
            ))
        }
        return (
            <InputSelectMedGeral label={"Selecione o medicamento"} lista={listaMedicamentoGeral} data={objMedicamentoGeral} setData={setObjMedicamentoGeral} />
        )
    }

    useEffect(() => {

        if (isLoading) {
            // const dataOperacao = dataHojeFormatada();
            const dataOperacao = new Date().toString();

            var validadeFormatada = formatarData(validade);

            const chaveMedicamentoEspecifico = (lote + '#' + dosagem + '#' + validadeFormatada).toString().toLowerCase().replace(/\s+/g, '');
            const chaveMedicamentoGeral = objMedicamentoGeral.value.chaveGeral;
            const chaveGeral = chaveMedicamentoGeral + '#' + chaveMedicamentoEspecifico;

            const dadosEstoque = {
                dataOperacao,
                quantidadeAnterior: '0',
                novaQuantidade: quantidade,
                motivo: "Doação",
                chaveMedicamentoEspecifico,
                chaveMedicamentoGeral,
                chaveDoador: doador.chaveDoador,
                chavePaciente: "-",
                chaveUsuario: state.chaveUsuario
            }

            const medicamentoEspecifico = {
                chaveMedicamentoGeral,
                chaveMedicamentoEspecifico,
                lote,
                dosagem,
                validade,
                quantidade,
                origem,
                tipo,
                fabricante,
                motivoDoacao,
                "dataEntrada": dataOperacao,
                chaveGeral
            }

            serverFunctions.appendRowMedicamentoEspecifico(medicamentoEspecifico, dadosEstoque).then((sucesso) => {
                if (sucesso) {
                    handleSomar();
                    setSucesso(true);
                    setDataMedicamentoGeral(null);
                    setLoading(false);
                    setMensagem(false);
                    setMensagemErroBack(false);
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
        if (lote != '' && dosagem != '' && validade != '' && origem != '' && tipo != '' && fabricante != '' && motivoDoacao != '' && quantidade != '' && objMedicamentoGeral != null) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [lote, dosagem, validade, origem, tipo, fabricante, motivoDoacao, quantidade, objMedicamentoGeral]);

    return (
        <Accordion.Item eventKey={eventKey} className='corDeFundo'>
            <Accordion.Header>Registrar doação do {eventKey}º medicamento</Accordion.Header>
            <Accordion.Body>
                {visualizarBody()}
            </Accordion.Body>
        </Accordion.Item>
    )
}
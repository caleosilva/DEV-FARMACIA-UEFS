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
import MedicamentoEspecifico from '../../../../../models/MedicamentoEspecifico';
import formatarData from '../../../Functions/formatarData';
import dataHojeFormatada from '../../../Functions/dataHojeFormatada';
import Doador from '../../../../../models/Doador';
import InputPositiveNumber from '../../../components/InputPositiveNumber';
import InputReactSelect from '../../../components/InputReactSelect';
import formatarDataParaVisualizacao from '../../../Functions/formatarDataParaVisualizacao';
import UserContext from '../../../contexts/user/context';
import gerarHashCode from '../../../Functions/gerarHashCode';

import React, { useEffect } from 'react';
import { useState, useContext } from 'react';


export default function ModalEstoqueCadastrar({ data, setData, listaDD, chaveMedicamentoGeral, listaDoadores }: { data: Array<MedicamentoEspecifico>, setData: Function, listaDD: string[][], chaveMedicamentoGeral: string, listaDoadores: Array<Doador> }) {

    const [avisoIncompleto, setAvisoIncompleto] = useState(false);
    const [controleImcopleto, setControleIncompleto] = useState(false);


    // Dados de quem tá logado.
    const { setState, state } = useContext(UserContext);

    // Controle ao clicar em cadastrar
    const handleClick = () => {
        setControleIncompleto(true);
        setLoading(true)
    };
    const [isLoading, setLoading] = useState(false);

    // Mensagem de erro:
    const [mensagem, setMensagem] = useState(false);
    const [mensagemErroBack, setMensagemErroBack] = useState(false);

    // Carrega os dados do DropDown
    const [lista, setLista] = useState([[]]);

    // Elementos do formulário:
    const [lote, setLote] = useState('');
    const [dosagem, setDosagem] = useState('');
    const [validade, setValidade] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [origem, setOrigem] = useState('');
    const [tipo, setTipo] = useState('');
    const [fabricante, setFabricante] = useState('');
    const [motivoDoacao, setMotivoDoacao] = useState('');

    const [doador, setDoador] = useState(null);

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
        var listaDoadorGeral = [{}];

        if (listaDoadores != null && listaDoadores) {
            listaDoadores.map((event: Doador, index) => (
                listaDoadorGeral.push({ value: event, label: gerarLabel(event) })
            ))
        }

        return (
            <Row className='mb-3'>
                <Col>
                    <InputReactSelect label={"Selecione o doador*"} lista={listaDoadorGeral} data={doador} setData={setDoador} />
                </Col>
            </Row>
        )

    }

    function renderDadosIncompletos() {
        if (avisoIncompleto) {
            return (
                <Row>
                    <Col className='mb-3 mt-2'>
                        <Alert variant="info" onClose={() => setAvisoIncompleto(false)} dismissible>
                            <Alert.Heading>Atenção</Alert.Heading>
                            <p>
                                Preencha corretamente todos os campos que possuem o indicativo * para concluir o cadastro.                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    // Cuida de abrir e fechar o modal:
    const handleClose = () => {
        setLote('');
        setDosagem('');
        setValidade('');
        setQuantidade('');
        setOrigem('');
        setTipo('');
        setFabricante('');
        setMotivoDoacao('');

        setShow(false);
        setDoador(null);
        setAvisoIncompleto(false);
    };
    const handleShow = () => setShow(true);

    const [show, setShow] = useState(false);

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if (lote != '' && dosagem != '' && validade != '' && origem != '' && tipo != '' && fabricante != '' && motivoDoacao != '' && quantidade != '' && doador != null && Object.keys(doador).length > 0) {
            setIsFormValid(true);
            setAvisoIncompleto(false);
        } else {
            setIsFormValid(false);
        }
    }, [lote, dosagem, validade, origem, tipo, fabricante, motivoDoacao, quantidade, doador]);

    // Realiza o cadastro
    useEffect(() => {

        if (isFormValid) {
            var validadeFormatada = formatarData(validade);
            var dataHoje = dataHojeFormatada();

            var chaveMedicamentoEspecificoStr = (lote + '#' + dosagem + '#' + validadeFormatada).toString().toLowerCase().replace(/\s+/g, '');
            var chaveMedicamentoEspecifico = gerarHashCode(chaveMedicamentoEspecificoStr);

            var chaveDoador = null;
            if (doador != null) {
                chaveDoador = doador.value.chaveDoador;
            }

            var chaveUsuario;
            if (state.chaveUsuario) {
                chaveUsuario = state.chaveUsuario
            }

            const dataOperacao = new Date().toString();

            const dadosEstoque = {
                dataOperacao,
                quantidadeAnterior: '0',
                novaQuantidade: quantidade,
                motivo: "Doação",
                chaveMedicamentoEspecifico,
                chaveMedicamentoGeral,
                chaveDoador,
                chavePaciente: "-",
                chaveUsuario
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
                "dataEntrada": dataHoje
            }


            if (isLoading) {
                serverFunctions.appendRowMedicamentoEspecifico(medicamentoEspecifico, dadosEstoque).then((sucesso) => {
                    if (sucesso) {
                        // Atualiza a tabela:
                        setData([...data, medicamentoEspecifico]);

                        // Limpa os formulários
                        setLote('');
                        setDosagem('');
                        setValidade('');
                        setQuantidade('');
                        setOrigem('');
                        setTipo('');
                        setFabricante('');
                        setMotivoDoacao('');

                        setLoading(false);
                        setMensagem(false);
                        setDoador(null);
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
                Cadastrar nova doação
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
                    <Modal.Title>Cadastro de doação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Container>
                            {renderSelectDoador()}

                            <Row>
                                <Col>
                                    <InputText type={"text"} required={true} label={"Dosagem*"} placeholder={""} controlId={"inputDosagem"} name={"dosagem"} data={dosagem} setData={setDosagem} />
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <InputText type={"text"} required={true} label={"Lote*"} placeholder={""} controlId={"inputLote"} name={"lote"} data={lote} setData={setLote} />
                                </Col>

                                <Col sm={6}>
                                    <InputText type={"date"} required={true} label={"Validade*"} placeholder={""} controlId={"inputValidade"} name={"validade"} data={validade} setData={setValidade} />
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <InputPositiveNumber required={true} label={"Quantidade*"} placeholder={""} controlId={"inputQuantidade"} name={"quantidade"} data={quantidade} setData={setQuantidade} max={9999} />
                                </Col>

                                <Col sm={6}>
                                    <InputText type={"text"} required={true} label={"Fabricante*"} placeholder={""} controlId={"inputFabricante"} name={"fabricante"} data={fabricante} setData={setFabricante} />
                                </Col>
                            </Row>

                            <Row className='mb-3'>

                                <Col >
                                    <InputSelect required={true} label={"Motivo da doação*"} name={"motivoDoacao"} data={motivoDoacao} setData={setMotivoDoacao} lista={lista ? lista[4] : []} />
                                </Col>
                            </Row>

                            <Row className='mb-3'>
                                <Col sm={6}>
                                    <InputSelect required={true} label={"Tipo*"} name={"tipo"} data={tipo} setData={setTipo} lista={lista ? lista[1] : []} />
                                </Col>



                                <Col sm={6}>
                                    <InputSelect required={true} label={"Origem*"} name={"origem"} data={origem} setData={setOrigem} lista={lista ? lista[5] : []} />
                                </Col>
                            </Row>

                            {renderErroExistente()}

                            {renderErroBack()}

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

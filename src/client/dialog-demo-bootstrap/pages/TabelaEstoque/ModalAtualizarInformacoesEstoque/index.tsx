import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Form } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';

import { serverFunctions } from '../../../../utils/serverFunctions';
import InputText from '../../../components/InputText';
import InputDate from '../../../components/InputDate';
import InputSelect from '../../../components/InputSelect';
import MedicamentoEspecifico from '../../../../../models/MedicamentoEspecifico';
import formatarData from '../../../Functions/formatarData.js';
import gerarObjetoEstiloMedicamentoEspecifico from '../../../Functions/gerarObjetoEstiloMedicamentoEspecifico';

import React, { useState, useEffect } from 'react';


export default function ModalAtualizarInfomacoesEstoque({ remedio, listaDD, data, setData, index }: { remedio: MedicamentoEspecifico, listaDD: string[][], data: Array<MedicamentoEspecifico>, setData: Function, index: number }) {

    const [avisoIncompleto, setAvisoIncompleto] = useState(false);
    const [controleImcopleto, setControleIncompleto] = useState(false);

    // CRIAR OS USESTATE
    const [lista, setLista] = useState([[]]);

    const [lote, setLote] = useState(remedio.lote);
    const [dosagem, setDosagem] = useState(remedio.dosagem);
    const [validade, setValidade] = useState(remedio.validade);
    const [origem, setOrigem] = useState(remedio.origem);
    const [tipo, setTipo] = useState(remedio.tipo);
    const [fabricante, setFabricante] = useState(remedio.fabricante);
    const [motivoDoacao, setMotivoDoacao] = useState(remedio.motivoDoacao);

    const dataEntrada = remedio.dataEntrada;
    const quantidade = remedio.quantidade;

    const dateValue = Date.parse(validade.toString());
    const dateObject = new Date(dateValue);

    const [show, setShow] = useState(false);
    const [mensagem, setMensagem] = useState(false);
    const [mensagemErroBack, setMensagemErroBack] = useState(false);

    const [alterado, setAlterado] = useState(false);

    const handleClose = () => {
        setLote(remedio.lote);
        setDosagem(remedio.dosagem);
        setValidade(remedio.validade);
        setOrigem(remedio.origem)
        setTipo(remedio.tipo);
        setFabricante(remedio.fabricante);
        setMotivoDoacao(remedio.motivoDoacao);

        setShow(false);
        setLoading(false);
        setMensagem(false);
        setMensagemErroBack(false);
        setAlterado(false);
        setAvisoIncompleto(false);
    };
    const handleShow = () => {
        setLote(remedio.lote);
        setDosagem(remedio.dosagem);
        setValidade(remedio.validade);
        setOrigem(remedio.origem)
        setTipo(remedio.tipo);
        setFabricante(remedio.fabricante);
        setMotivoDoacao(remedio.motivoDoacao);
        
        setAlterado(false);
        setShow(true)
    };


    const handleClick = () => {
        setControleIncompleto(true);
        setLoading(true)
    };
    const [isLoading, setLoading] = useState(false);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Atualizar informações
        </Tooltip>
    );

    function renderAlertaExistente() {
        if (mensagem) {
            return (
                <Row className='mb-3 mt-3'>
                    <Col>
                        <Alert variant="danger" onClose={() => setMensagem(false)} dismissible>
                            <Alert.Heading>Não foi possível atualizar as informações</Alert.Heading>
                            <p>
                                Já existe um medicamento cadastrado com esse lote, dosagem e validade.
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    function renderAlertaErroBack() {
        if (mensagemErroBack) {
            <Row className='mb-3 mt-3'>
                <Col>
                    <Alert variant="dark" onClose={() => setMensagemErroBack(false)} dismissible>
                        <Alert.Heading>Erro!</Alert.Heading>
                        <p>
                            Não foi possível atualizar as informações, tente novamente mais tarde!
                        </p>
                    </Alert>
                </Col>
            </Row>
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
        var localDataString = formatarData(validade);

        if (lote !== '' && dosagem !== '' && origem !== '' && tipo !== '' && fabricante !== '' && motivoDoacao !== '' && (!isNaN(dateObject.getTime())) && localDataString.length <= 10) {
            setIsFormValid(true);
            setAvisoIncompleto(false);
        } else {
            setIsFormValid(false);
        }

        setAlterado(true);
    }, [lote, dosagem, origem, tipo, fabricante, motivoDoacao, validade]);

    useEffect(() => {

        if (isFormValid) {
            if (!alterado) {
                setLoading(false);
                setMensagem(false);
                handleClose();
            } else {
                const dadosMedicamentoEspecifico = new MedicamentoEspecifico(remedio.chaveMedicamentoGeral, remedio.chaveMedicamentoEspecifico, lote, dosagem, validade, quantidade, origem, tipo, fabricante, motivoDoacao, dataEntrada);

                if (isLoading) {

                    serverFunctions.updateRowEstoque(dadosMedicamentoEspecifico).then((sucesso) => {
                        if (sucesso) {
                            var novosDados = gerarObjetoEstiloMedicamentoEspecifico(dadosMedicamentoEspecifico);
                            data[index] = novosDados;

                            setData([...data]);

                            setAlterado(false);
                            setMensagem(false);
                            setLoading(false);
                            handleClose();
                        } else {
                            setMensagem(true);
                            setLoading(false);
                        }
                    }).catch(
                        (e) => {
                            console.log(e.stack);
                            setMensagemErroBack(true);
                            setLoading(false);
                        });
                }
            }
        } else {
            if (controleImcopleto) {
                setAvisoIncompleto(true);
            }
            setLoading(false);
        }

    }, [isLoading]);

    useEffect(() => {
        setLista(listaDD);
    }, [listaDD]);


    return (

        <>
            <OverlayTrigger
                placement="left"
                delay={{ show: 400, hide: 250 }}
                overlay={renderTooltip}
            >
                <Button variant="outline-secondary" onClick={handleShow}>
                    <i className="bi bi-pencil-square"></i>
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
                    <Modal.Title>Edição de informações</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col sm={6}>
                                <InputText required={true} type={"text"} placeholder='' name={"lote"} label={"Lote*"} controlId={"inputLote"} data={lote} setData={setLote} />
                            </Col>

                            <Col sm={6}>
                                <InputText required={true} type={"text"} placeholder='' name={"dosagem"} label={"Dosagem*"} controlId={"inputDosagem"} data={dosagem} setData={setDosagem} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <InputText required={true} type={"text"} placeholder='' name={"fabricante"} label={"Fabricante*"} controlId={"inputFabricante"} data={fabricante} setData={setFabricante} />
                            </Col>

                            <Col sm={6}>
                                <InputDate label={"Data de validade*"} controlId={"inputDataValidade"} name={"inputDataValidade"} data={dateObject} setData={setValidade} />
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <InputSelect required={true} label={"Origem*"} name={"origem"} data={origem} setData={setOrigem} lista={listaDD ? listaDD[5] : []} />

                            </Col>

                            <Col sm={6}>
                                <InputSelect required={true} label={"Tipo*"} name={"tipo"} data={tipo} setData={setTipo} lista={listaDD ? listaDD[1] : []} />

                            </Col>
                        </Row>

                        <Row>
                            <Col sm={6}>
                                <InputSelect required={true} label={"Motivo da doação*"} name={"motivoDoacao"} data={motivoDoacao} setData={setMotivoDoacao} lista={listaDD ? listaDD[4] : []} />

                            </Col>
                        </Row>

                        {renderAlertaExistente()}

                        {renderAlertaErroBack()}

                    </Container>

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
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
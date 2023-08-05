import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { Form } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';

import InputText from '../../../components/InputText';
import InputSelect from '../../../components/InputSelect';
import { serverFunctions } from '../../../../utils/serverFunctions';
import Paciente from '../../../../../models/Paciente';
import InputTelefone from '../../../components/InputTelefone';
import InputCpf from '../../../components/InputCpf';
import InputDate from '../../../components/InputDate';
import formatarData from '../../../Functions/formatarData';
import gerarObjetoEstiloPaciente from '../../../Functions/gerarObjetoEstiloPaciente';

export default function ModalAtualizarPaciente({ paciente, index, listaDrop, data, setData }:
    { paciente: Paciente, index: number, listaDrop: string[][], data: Array<Paciente>, setData: Function }) {

    const [lista, setLista] = useState([[]]);

    const [avisoIncompleto, setAvisoIncompleto] = useState(false);
    const [controleImcopleto, setControleIncompleto] = useState(false);

    const [alterado, setAlterado] = useState(false);

    const [nome, setNome] = useState(paciente.nome);
    const [cpf, setCpf] = useState(paciente.cpf);
    const [dataNascimento, setDataNascimento] = useState(paciente.dataNascimento);
    const [telefone, setTelefone] = useState(paciente.telefone);
    const [tipoPaciente, setTipoPaciente] = useState(paciente.tipoPaciente);
    const [sexo, setSexo] = useState(paciente.sexo);
    const [estadoCivil, setEstadoCivil] = useState(paciente.estadoCivil);
    const [cidade, setCidade] = useState(paciente.cidade);
    const [bairro, setBairro] = useState(paciente.bairro);
    const [endereco, setEndereco] = useState(paciente.endereco);
    const [numero, setNumero] = useState(paciente.numero);
    const [comoSoube, setComoSoube] = useState(paciente.comoSoube);
    const [nivelEscolaridade, setNivelEscolaridade] = useState(paciente.nivelEscolaridade);
    const [profissao, setProfissao] = useState(paciente.profissao);

    const [nomeSocial, setNomeSocial] = useState(paciente.nomeSocial);
    const [identidadeGenero, setIdentidadeGenero] = useState(paciente.identidadeGenero);

    const chavePaciente = paciente.chavePaciente;
    const dateValue = Date.parse(dataNascimento.toString());
    const dateObject = new Date(dateValue);


    const [show, setShow] = useState(false);

    const handleClose = () => {
        setNome(paciente.nome);
        setCpf(paciente.cpf);
        setDataNascimento(paciente.dataNascimento);
        setTelefone(paciente.telefone);
        setTipoPaciente(paciente.tipoPaciente);
        setSexo(paciente.sexo);
        setEstadoCivil(paciente.estadoCivil);
        setCidade(paciente.cidade);
        setBairro(paciente.bairro);
        setEndereco(paciente.endereco);
        setNumero(paciente.numero);
        setComoSoube(paciente.comoSoube);
        setNomeSocial(paciente.nomeSocial);
        setIdentidadeGenero(paciente.identidadeGenero);

        setShow(false);
        setMensagem(false);
        setAlterado(false);
        setAvisoIncompleto(false);
    };

    const handleShow = () => {
        setShow(true);
        setAlterado(false);
    };

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

    // Controle ao clicar em atualizar
    const handleClick = () => {
        setControleIncompleto(true);
        setLoading(true)
    };
    const [isLoading, setLoading] = useState(false);

    const [mensagem, setMensagem] = useState(false);
    const [mensagemErroBack, setMensagemErroBack] = useState(false);

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        var localDataString = formatarData(dataNascimento);

        if (nome !== '' && cpf !== '' && cpf.length === 14 && (!isNaN(dateObject.getTime())) && localDataString.length <= 10 && telefone !== '' && telefone.length >= 14 && tipoPaciente !== '' && sexo !== '' && estadoCivil !== '' && cidade !== '' && bairro !== '' && endereco !== '' && numero !== '' && comoSoube !== '' && nivelEscolaridade !== '' && profissao !== '' && identidadeGenero !== '') {
            setIsFormValid(true);
            setAvisoIncompleto(false);
        } else {
            setIsFormValid(false);
        }

        setAlterado(true);
    }, [nome, cpf, dataNascimento, telefone, tipoPaciente, sexo, estadoCivil, cidade, bairro, endereco, numero, comoSoube, nivelEscolaridade, profissao, identidadeGenero, nomeSocial]);


    useEffect(() => {
        if (isFormValid) {
            if (!alterado) {
                setLoading(false);
                setMensagem(false);
                handleClose();
            } else {

                var nomeSocialTratado = nomeSocial;
                if (nomeSocial === '') {
                    nomeSocialTratado = '-';
                }

                const dados = {
                    chavePaciente,
                    nome,
                    cpf,
                    dataNascimento,
                    telefone,
                    tipoPaciente,
                    sexo,
                    estadoCivil,
                    cidade,
                    bairro,
                    endereco,
                    numero,
                    comoSoube,
                    nivelEscolaridade,
                    profissao,
                    identidadeGenero,
                    nomeSocial: nomeSocialTratado
                }
                if (isLoading) {
                    serverFunctions.updateRowPaciente(dados).then((sucesso) => {
                        if (sucesso) {
                            const novosDados = gerarObjetoEstiloPaciente(dados);
                            data[index] = novosDados;
                            setData([...data]);

                            setMensagem(false);
                            setLoading(false);
                            handleClose();
                            setAlterado(false);

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

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Atualizar informações
        </Tooltip>
    )

    function renderWarningDadosExistentes() {
        if (mensagem) {
            return (
                <Row className='mb-3 mt-3'>
                    <Col>
                        <Alert variant="danger" onClose={() => setMensagem(false)} dismissible>
                            <Alert.Heading>Não foi possível atualizar as informações</Alert.Heading>
                            <p>
                                Já existe um paciente cadastrado com o CPF, CNPJ ou Nome inserido.
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
                                Não foi possível atualizar as informações, tente novamente mais tarde!
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )

        }
    }

    useEffect(() => {
        setLista(listaDrop)
    }, [listaDrop]);

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
                    <Modal.Title>Atualizar dados de um paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form>

                            <Row>
                                <Col sm={6}>
                                    <InputText type={"text"} required={true} label={"Nome*"} placeholder={""} controlId={"inputNome"} name={"nome"} data={nome} setData={setNome} />
                                </Col>

                                <Col sm={6}>
                                    <InputCpf label={"CPF*"} placeholder={"XXX.XXX.XXX-XX"} controlId={"inputCpf"} name={"cpf"} data={cpf} setData={setCpf} />
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <InputText type={"text"} required={true} label={"Nome social"} placeholder={""} controlId={"inputNomeSocial"} name={"nomeSocial"} data={nomeSocial} setData={setNomeSocial} />
                                </Col>

                                <Col sm={6}>
                                    <InputSelect required={true} label={"Identidade de gênero*"} name={"identidadeGenero"} data={identidadeGenero} setData={setIdentidadeGenero} lista={lista ? lista[14] : []} />

                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <InputTelefone label={"Telefone*"} placeholder={"(XX) XXXXX-XXXX"} controlId={"inputTelefone"} name={"telefone"} data={telefone} setData={setTelefone} />
                                </Col>

                                <Col sm={6}>
                                    <InputDate label={"Data de nascimento*"} controlId={"inputNascimento"} name={"nascimento"} data={dateObject} setData={setDataNascimento} />
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <InputSelect required={true} label={"Tipo do paciente*"} name={"tipoPaciente"} data={tipoPaciente} setData={setTipoPaciente} lista={lista ? lista[9] : []} />
                                </Col>

                                <Col sm={6}>
                                    <InputSelect required={true} label={"Como soube*"} name={"comoSoube"} data={comoSoube} setData={setComoSoube} lista={lista ? lista[12] : []} />
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <InputSelect required={true} label={"Sexo*"} name={"sexo"} data={sexo} setData={setSexo} lista={lista ? lista[7] : []} />
                                </Col>

                                <Col sm={6}>
                                    <InputSelect required={true} label={"Estado civil*"} name={"estadoCivil"} data={estadoCivil} setData={setEstadoCivil} lista={lista ? lista[8] : []} />
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <InputText type={"text"} required={true} label={"Cidade*"} placeholder={""} controlId={"inputCidade"} name={"cidade"} data={cidade} setData={setCidade} />
                                </Col>

                                <Col sm={6}>
                                    <InputText type={"text"} required={true} label={"Bairro*"} placeholder={""} controlId={"inputBairro"} name={"bairro"} data={bairro} setData={setBairro} />
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <InputText type={"text"} required={true} label={"Endereço*"} placeholder={""} controlId={"inputEndereco"} name={"endereco"} data={endereco} setData={setEndereco} />
                                </Col>

                                <Col sm={6}>
                                    <InputText type={"text"} required={true} label={"Complemento*"} placeholder={""} controlId={"inputNumero"} name={"numero"} data={numero} setData={setNumero} />
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <InputSelect required={true} label={"Nível de escolaridade*"} name={"nivelEscolaridade"} data={nivelEscolaridade} setData={setNivelEscolaridade} lista={lista ? lista[13] : []} />
                                </Col>

                                <Col sm={6}>
                                    <InputText type={"text"} required={true} label={"Profissão*"} placeholder={""} controlId={"inputProfissao"} name={"profissao"} data={profissao} setData={setProfissao} />
                                </Col>
                            </Row>

                            {renderWarningDadosExistentes()}

                            {renderWarningBackError()}
                        </Form>
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

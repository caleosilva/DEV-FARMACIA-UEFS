import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { Form } from 'react-bootstrap';

import InputText from '../../../components/InputText';
import InputSelect from '../../../components/InputSelect';
import InputCpf from '../../../components/InputCpf';
import InputTelefone from '../../../components/InputTelefone';
import { serverFunctions } from '../../../../utils/serverFunctions';
import Paciente from '../../../../../models/Paciente';
import UserContext from '../../../contexts/user/context';

import React, { useEffect, useContext } from 'react';
import { useState } from 'react';


export default function ModalCadastarPaciente({ data, setData, listaDD }: { data: Array<Paciente>, setData: Function, listaDD: string[][] }) {

    const { setState, state } = useContext(UserContext);

    const [avisoIncompleto, setAvisoIncompleto] = useState(false);
    const [controleImcopleto, setControleIncompleto] = useState(false);


    // Controle ao clicar em cadastrar
    const handleClick = () => {
        setControleIncompleto(true);
        setLoading(true)
    };
    const [isLoading, setLoading] = useState(false);

    // Mensagem de erro:
    const [mensagem, setMensagem] = useState(false);

    // Carrega os dados do DropDown
    const [lista, setLista] = useState([[]]);

    // Elementos do formulário:
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [tipoPaciente, setTipoPaciente] = useState('');
    const [sexo, setSexo] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('');
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [comoSoube, setComoSoube] = useState('');
    const [nivelEscolaridade, setNivelEscolaridade] = useState('');
    const [profissao, setProfissao] = useState('');

    const [nomeSocial, setNomeSocial] = useState('');
    const [identidadeGenero, setIdentidadeGenero] = useState('');

    const [mensagemErroBack, setMensagemErroBack] = useState(false);

    // Cuida de abrir e fechar o modal:
    const handleClose = () => {
        setNome('');
        setCpf('');
        setDataNascimento('');
        setTelefone('');
        setTipoPaciente('');
        setSexo('');
        setEstadoCivil('');
        setCidade('');
        setBairro('');
        setEndereco('');
        setNumero('');
        setComoSoube('');
        setNomeSocial('');
        setIdentidadeGenero('');

        setShow(false);
        setMensagem(false);
        setAvisoIncompleto(false);
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

    const handleShow = () => setShow(true);

    const [show, setShow] = useState(false);

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if (nome !== '' && cpf !== '' && cpf.length === 14 && dataNascimento !== '' && telefone !== '' && telefone.length >= 14 && tipoPaciente !== '' && sexo !== '' && estadoCivil !== '' && cidade !== '' && bairro !== '' && endereco !== '' && numero !== '' && comoSoube !== '' && profissao !== '' && nivelEscolaridade !== '' && identidadeGenero !== '') {
            setIsFormValid(true);
            setAvisoIncompleto(false);
        } else {
            setIsFormValid(false);
        }
    }, [nome, cpf, dataNascimento, telefone, tipoPaciente, sexo, estadoCivil, cidade, bairro, endereco, numero, comoSoube, profissao,
        nivelEscolaridade, identidadeGenero]);


    // Realiza o cadastro //TO-DO
    useEffect(() => {

        if (isFormValid) {
            var chaveUsuario;
            if (state.chaveUsuario) {
                chaveUsuario = state.chaveUsuario
            }

            var nomeSocialTratado = '-';
            if (nomeSocial !== ''){
                nomeSocialTratado = nomeSocial;
            }

            const dados = {
                "chavePaciente": cpf,
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
                profissao,
                nivelEscolaridade,
                chaveUsuario,
                nomeSocial: nomeSocialTratado,
                identidadeGenero
            }

            if (isLoading) {

                serverFunctions.appendRowPacientes(dados).then((sucesso) => {
                    if (sucesso) {
                        // Atualiza a tabela:
                        setData([...data, dados]);

                        // Limpa os formulários:
                        setNome('');
                        setCpf('');
                        setDataNascimento('');
                        setTelefone('');
                        setTipoPaciente('');
                        setSexo('');
                        setEstadoCivil('');
                        setCidade('');
                        setBairro('');
                        setEndereco('');
                        setNumero('');
                        setComoSoube('');
                        setNivelEscolaridade('');
                        setProfissao('');
                        setNomeSocial('');
                        setIdentidadeGenero('');

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

        // var dataNascimentoFormatada = formatarData(dataNascimento);


    }, [isLoading]);

    // Carrega as informações do dropdown
    useEffect(() => {
        setLista(listaDD)
    }, [listaDD]);

    return (
        <>
            <Button variant="outline-secondary" onClick={handleShow}>
                Cadastrar paciente
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
                    <Modal.Title>Cadastro de paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Container>

                            <Row>
                                <Col sm={6}>
                                    <InputText type={"text"} required={true} label={"Nome civil*"} placeholder={""} controlId={"inputNome"} name={"nome"} data={nome} setData={setNome} />
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
                                    <InputText type={"date"} required={true} label={"Data de nascimento*"} placeholder={""} controlId={"inputNascimento"} name={"nascimento"} data={dataNascimento} setData={setDataNascimento} />
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

                            <Row>
                                {mensagem &&
                                    <Col className='mb-3 mt-2 mt-3'>
                                        <Alert variant="danger" onClose={() => setMensagem(false)} dismissible>
                                            <Alert.Heading>Não foi possível realizar o cadastro</Alert.Heading>
                                            <p>
                                                Já existe um paciente com o CPF inserido.
                                            </p>
                                        </Alert>
                                    </Col>
                                }
                            </Row>

                            <Row>
                                {mensagemErroBack &&
                                    <Col className='mb-3 mt-3'>
                                        <Alert variant="dark" onClose={() => setMensagemErroBack(false)} dismissible>
                                            <Alert.Heading>Erro!</Alert.Heading>
                                            <p>
                                                Não foi possível cadastrar o paciente, tente novamente mais tarde!
                                            </p>
                                        </Alert>
                                    </Col>
                                }
                            </Row>
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
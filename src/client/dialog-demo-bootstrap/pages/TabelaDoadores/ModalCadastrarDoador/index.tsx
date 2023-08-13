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
import InputCnpj from '../../../components/InputCnpj';
import { serverFunctions } from '../../../../utils/serverFunctions';
import Doador from '../../../../../models/Doador';
import gerarObjetoEstiloDoador from '../../../Functions/gerarObjetoEstiloDoador';
import gerarHashCode from '../../../Functions/gerarHashCode';
import UserContext from '../../../contexts/user/context';


import React, { useEffect, useContext } from 'react';
import { useState } from 'react';


export default function ModalCadastarDoador({ data, setData, listaDD }: { data: Array<Doador>, setData: Function, listaDD: string[][] }) {

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
    const [tipoDoador, setTipoDoador] = useState('');
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [comoSoube, setComoSoube] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [sexo, setSexo] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('');

    const [nomeSocial, setNomeSocial] = useState('');
    const [identidadeGenero, setIdentidadeGenero] = useState('');

    const [mensagemErroBack, setMensagemErroBack] = useState(false);

    // Cuida de abrir e fechar o modal:
    const handleClose = () => {
        setNome('');
        setTipoDoador('');
        setCidade('');
        setBairro('');
        setEndereco('');
        setNumero('');
        setComoSoube('');
        setCnpj('');
        setCpf('');
        setDataNascimento('');
        setSexo('');
        setEstadoCivil('');

        setNomeSocial('');
        setIdentidadeGenero('');

        setAvisoIncompleto(false);
        setShow(false);
        setMensagem(false);

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

    function renderCamposCondicionais() {
        if (tipoDoador === 'Pessoa física') {
            return (
                <>
                    <Row>
                        <Col sm={6}>
                            <InputCpf label={"CPF*"} placeholder={"XXX.XXX.XXX-XX"} controlId={"inputCpf"} name={"cpf"} data={cpf} setData={setCpf} />
                        </Col>

                        <Col sm={6}>
                            <InputText type={"date"} required={true} label={"Data de nascimento*"} placeholder={""} controlId={"inputNascimento"} name={"nascimento"} data={dataNascimento} setData={setDataNascimento} />
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
                            <InputSelect required={true} label={"Sexo*"} name={"sexo"} data={sexo} setData={setSexo} lista={lista ? lista[7] : []} />
                        </Col>

                        <Col sm={6}>
                            <InputSelect required={true} label={"Estado Civil*"} name={"estadoCivil"} data={estadoCivil} setData={setEstadoCivil} lista={lista ? lista[8] : []} />
                        </Col>
                    </Row>

                </>
            )

        } else if (tipoDoador === 'Pessoa jurídica') {
            return (
                <>
                    <Row>
                        <Col sm={6}>
                            <InputCnpj label={"CNPJ*"} placeholder={"XX.XXX.XXX/XXXX-XX"} controlId={"inputCnpj"} name={"cnpj"} data={cnpj} setData={setCnpj} />
                        </Col>
                    </Row>

                </>
            )
        }

    }

    function renderAlertaExistente() {
        if (mensagem) {

            var texto;
            if (tipoDoador === 'Pessoa física') {
                texto = "Já existe um doador com o CPF inserido";
            } else if (tipoDoador === 'Pessoa jurídica') {
                texto = "Já existe um doador com o CNPJ inserido";
            } else {
                texto = "Já existe um doador com o Nome inserido";
            }

            return (
                <Row >
                    <Col className='mb-3 mt-2 mt-3'>
                        <Alert variant="danger" onClose={() => setMensagem(false)} dismissible>
                            <Alert.Heading>Não foi possível realizar o cadastro</Alert.Heading>
                            <p>
                                {texto}
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    function renderAlertaBack() {
        if (mensagemErroBack) {
            return (
                <Row >
                    <Col className='mb-3 mt-3'>
                        <Alert variant="dark" onClose={() => setMensagemErroBack(false)} dismissible>
                            <Alert.Heading>Erro!</Alert.Heading>
                            <p>
                                Não foi possível cadastrar o doador, tente novamente mais tarde!
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {

        if (nome !== '' && cidade !== '' && bairro !== '' && endereco !== '' && numero !== '' && comoSoube !== '' && tipoDoador === "Outro") {
            setIsFormValid(true);
            setAvisoIncompleto(false);
        } else if ((nome !== '' && cidade !== '' && bairro !== '' && endereco !== '' && numero !== '' && comoSoube !== '' && cnpj.length === 18) && (tipoDoador === "Pessoa jurídica")) {
            setIsFormValid(true);
            setAvisoIncompleto(false);
        } else if ((nome !== '' && cidade !== '' && bairro !== '' && endereco !== '' && numero !== '' && comoSoube !== '' && cpf.length >= 13 && dataNascimento !== '' && dataNascimento !== '-' && sexo !== '' && sexo !== '-' && estadoCivil !== '' && estadoCivil !== '-' && identidadeGenero !== '') && (tipoDoador === "Pessoa física")) {
            setIsFormValid(true);
            setAvisoIncompleto(false);
        } else {
            setIsFormValid(false);
        }
    }, [nome, tipoDoador, cidade, bairro, endereco, numero, comoSoube, cnpj, cpf, dataNascimento, sexo, estadoCivil, identidadeGenero]);

    useEffect(() => {
        if (tipoDoador === 'Pessoa física') {
            setCnpj('-');

            setDataNascimento('');
            setCpf('');
            setSexo('');
            setEstadoCivil('');
        } else if (tipoDoador === 'Pessoa jurídica') {
            setCpf('-');
            setDataNascimento('-');
            setSexo('-');
            setEstadoCivil('-');

            setNomeSocial('-');
            setIdentidadeGenero('-');

            setCnpj('');
        } else if (tipoDoador === 'Outro') {
            setCnpj('-');
            setCpf('-');
            setDataNascimento('-');
            setSexo('-');
            setEstadoCivil('-');

            setNomeSocial('-');
            setIdentidadeGenero('-');
        }

    }, [tipoDoador]);

    // Realiza o cadastro
    useEffect(() => {

        if (isFormValid) {
            var chaveDoador = '';
            if (tipoDoador === 'Pessoa física') {
                chaveDoador = gerarHashCode(cpf);
            } else if (tipoDoador === 'Pessoa jurídica') {
                chaveDoador = gerarHashCode(cnpj);

            } else if (tipoDoador === 'Outro') {
                var nomeLimpo = nome.replace(/\s/g, '').toString().toLowerCase();
                chaveDoador = gerarHashCode(nomeLimpo);
            }

            var chaveUsuario;

            if (state.chaveUsuario) {
                chaveUsuario = state.chaveUsuario
            }

            var nomeSocialTratado = '-';
            if (nomeSocial !== '') {
                nomeSocialTratado = nomeSocial;
            }

            const dados = {
                chaveDoador,
                nome,
                tipoDoador,
                cidade,
                bairro,
                endereco,
                numero,
                comoSoube,
                cnpj,
                cpf,
                dataNascimento,
                sexo,
                estadoCivil,
                chaveUsuario,
                nomeSocial: nomeSocialTratado,
                identidadeGenero
            }
            if (isLoading) {
                serverFunctions.appendRowDoadores(dados).then((sucesso) => {
                    if (sucesso) {
                        // Atualiza a tabela:
                        var novosDados = gerarObjetoEstiloDoador(dados);

                        setData([...data, novosDados]);

                        // Limpa os formulários:
                        setNome('');
                        setTipoDoador('');
                        setCidade('');
                        setBairro('');
                        setEndereco('');
                        setNumero('');
                        setComoSoube('');
                        setCnpj('');
                        setCpf('');
                        setDataNascimento('');
                        setSexo('');
                        setEstadoCivil('');

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
                Cadastrar doador
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
                    <Modal.Title>Cadastro de doador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Container>

                            <Row>
                                <Col>
                                    <InputText type={"text"} required={true} label={"Nome*"} placeholder={""} controlId={"inputNome"} name={"nome"} data={nome} setData={setNome} />
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
                                    <InputSelect required={true} label={"Como soube?*"} name={"comoSoube"} data={comoSoube} setData={setComoSoube} lista={lista ? lista[12] : []} />
                                </Col>

                                <Col sm={6}>
                                    <InputSelect required={true} label={"Tipo do doador*"} name={"tipoDoador"} data={tipoDoador} setData={setTipoDoador} lista={lista ? lista[6] : []} />
                                </Col>
                            </Row>

                            {renderCamposCondicionais()}

                            {renderAlertaExistente()}

                            {renderAlertaBack()}
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
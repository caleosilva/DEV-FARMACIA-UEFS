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
import Doador from '../../../../../models/Doador';
import InputCnpj from '../../../components/InputCnpj';
import InputCpf from '../../../components/InputCpf';
import InputDate from '../../../components/InputDate';
import gerarObjetoEstiloDoador from '../../../Functions/gerarObjetoEstiloDoador';
import formatarData from '../../../Functions/formatarData.js';


function MedModalAtualizar({ doador, index, listaDrop, data, setData }:
    { doador: Doador, index: number, listaDrop: string[][], data: Array<Doador>, setData: Function }) {

    const [avisoIncompleto, setAvisoIncompleto] = useState(false);
    const [controleImcopleto, setControleIncompleto] = useState(false);

    const [lista, setLista] = useState([[]]);

    const [alterado, setAlterado] = useState(false);

    const [nome, setNome] = useState(doador.nome);
    const [cidade, setCidade] = useState(doador.cidade);
    const [bairro, setBairro] = useState(doador.bairro);
    const [endereco, setEndereco] = useState(doador.endereco);
    const [numero, setNumero] = useState(doador.numero);
    const [comoSoube, setComoSoube] = useState(doador.comoSoube);
    const [cnpj, setCnpj] = useState(doador.cnpj);
    const [cpf, setCpf] = useState(doador.cpf);
    const [dataNascimento, setDataNascimento] = useState(doador.dataNascimento);
    const [sexo, setSexo] = useState(doador.sexo);
    const [estadoCivil, setEstadoCivil] = useState(doador.estadoCivil);

    const [nomeSocial, setNomeSocial] = useState(doador.nomeSocial);
    const [identidadeGenero, setIdentidadeGenero] = useState(doador.identidadeGenero);

    const chaveDoador = doador.chaveDoador;
    const tipoDoador = doador.tipoDoador;

    const dateValue = Date.parse(dataNascimento.toString());
    const dateObject = new Date(dateValue);


    const [show, setShow] = useState(false);

    const handleClose = () => {
        setNome(doador.nome);
        setCidade(doador.cidade);
        setBairro(doador.bairro);
        setEndereco(doador.endereco);
        setNumero(doador.numero);
        setComoSoube(doador.comoSoube);
        setCnpj(doador.cnpj);
        setCpf(doador.cpf);
        setDataNascimento(doador.dataNascimento);
        setSexo(doador.sexo);
        setEstadoCivil(doador.estadoCivil);

        setNomeSocial(doador.nomeSocial);
        setIdentidadeGenero(doador.identidadeGenero);

        setAvisoIncompleto(false);
        setShow(false);
        setMensagem(false);
        setAlterado(false);
    };

    const handleShow = () => {
        setShow(true);
        setAlterado(false);
    };

    // Controle ao clicar em atualizar
    const handleClick = () => {
        setControleIncompleto(true);
        setLoading(true)
    };
    const [isLoading, setLoading] = useState(false);

    const [mensagem, setMensagem] = useState(false);

    const [mensagemErroBack, setMensagemErroBack] = useState(false);

    function renderCamposCondicionais() {
        if (tipoDoador === 'Pessoa física') {

            return (
                <>
                    <Row>
                        <Col sm={6}>
                            <InputCpf label={"CPF*"} placeholder={"XXX.XXX.XXX-XX"} controlId={"inputCpf"} name={"cpf"} data={cpf} setData={setCpf} />
                        </Col>

                        <Col sm={6}>
                            <InputDate label={"Data de nascimento*"} controlId={"inputNascimento"} name={"nascimento"} data={dateObject} setData={setDataNascimento} />
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

        var localDataString = formatarData(dataNascimento);

        if (tipoDoador === "Outro" && nome !== '' && cidade !== '' && bairro !== '' && endereco !== '' && numero !== '' && comoSoube !== '') {
            setIsFormValid(true);
        } else if (tipoDoador === "Pessoa jurídica" && nome !== '' && cidade !== '' && bairro !== '' && endereco !== '' && numero !== '' && comoSoube !== '' && cnpj !== '' && cnpj.length == 18) {
            setIsFormValid(true);
            setAvisoIncompleto(false);
        } else if (tipoDoador === "Pessoa física" && nome !== '' && cidade !== '' && bairro !== '' && endereco !== '' && numero !== '' && comoSoube !== '' && cpf !== '' && cpf.length === 14 && (!isNaN(dateObject.getTime())) && localDataString.length <= 10 && sexo !== '' && estadoCivil !== '' && identidadeGenero !== '') {
            setIsFormValid(true);
            setAvisoIncompleto(false);
        } else {
            setIsFormValid(false);
        }
        setAlterado(true);

    }, [nome, cidade, bairro, endereco, numero, comoSoube, cnpj, cpf, dataNascimento, sexo, estadoCivil, identidadeGenero, nomeSocial]);

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
                    nomeSocial: nomeSocialTratado,
                    identidadeGenero
                }

                if (isLoading) {
                    serverFunctions.updateRowDoador(dados).then((sucesso) => {
                        if (sucesso) {
                            var novosDados = gerarObjetoEstiloDoador(dados);
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
                    <Modal.Title>Atualizar dados de um doador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form>
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
                                <Col>
                                    <InputText type={"text"} required={true} label={"Endereço*"} placeholder={""} controlId={"inputEndereco"} name={"endereco"} data={endereco} setData={setEndereco} />
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <InputText type={"text"} required={true} label={"Complemento*"} placeholder={""} controlId={"inputNumero"} name={"numero"} data={numero} setData={setNumero} />
                                </Col>

                                <Col sm={6}>
                                    <InputSelect required={true} label={"Como soube?"} name={"comoSoube*"} data={comoSoube} setData={setComoSoube} lista={lista ? lista[12] : []} />
                                </Col>
                            </Row>

                            {renderCamposCondicionais()}

                            <Row className='mb-3 mt-3'>
                                {mensagem &&
                                    <Col>
                                        <Alert variant="danger" onClose={() => setMensagem(false)} dismissible>
                                            <Alert.Heading>Não foi possível atualizar as informações</Alert.Heading>
                                            <p>
                                                Já existe um doador cadastrado com o CPF, CNPJ ou Nome inserido.
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
                                                Não foi possível atualizar as informações, tente novamente mais tarde!
                                            </p>
                                        </Alert>
                                    </Col>
                                }
                            </Row>


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

export default MedModalAtualizar;

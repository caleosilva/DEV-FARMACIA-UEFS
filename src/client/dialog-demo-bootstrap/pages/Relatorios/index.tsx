import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import React from 'react';
import { useState, useEffect } from 'react';

import InputSelect from '../../components/InputSelect';
import { serverFunctions } from '../../../utils/serverFunctions';
import formatarDataParaVisualizacao from '../../Functions/formatarDataParaVisualizacao';
import EstoquePDF from './GerarPDF';
import Paciente from '../../../../models/Paciente'
import Doador from '../../../../models/Doador'
import InputReactSelect from '../../components/InputReactSelect';
import './TelaRelatorio.css';


export default function TabelaRelatorios() {

    const [dataUriImg, setDataUriImg] = useState('');

    const [dataPacientes, setDataPacientes] = useState(null);
    const [dataDoadores, setDataDoadores] = useState(null);

    const [objPaciente, setObjPaciente] = useState(null);
    const [objDoador, setObjDoador] = useState(null);

    const [infoDD, setInfoDD] = useState(null);
    const [dadosConfig, setDadosConfig] = useState(null);

    const [data, setData] = useState(null);
    const [botaoClicado, setBotaoClicado] = useState(null);

    const [opcRelatorio, setOpcRelatorio] = useState('');
    const [opcFiltro, setOpcFiltro] = useState('Todos');

    const [dataInicial, setDataInicial] = useState(null);
    const [dataFinal, setDataFinal] = useState(new Date().toISOString().split('T')[0]);

    const [busca, setBusca] = useState('');

    const [msgDataErrada, setMsgDataErrada] = useState(false);

    const [opcFiltroVisualizacao, setOpcFiltroVisualizacao] = useState('');

    const [dataInicialVisualizacao, setDataInicialVisualizacao] = useState('');
    const [dataFinalVisualizacao, setDataFinalVisualizacao] = useState('');

    const [dadosFiltroRelatorioGerado, setDadosFiltroRelatorioGerado] = useState(null);

    const handleGerarPDF = () => {
        EstoquePDF({ dados: data, opcRelatorio: opcRelatorio, dadosFiltros: dadosFiltroRelatorioGerado, dataUriImg: dataUriImg });
    }

    const gerarLabelDoador = (event) => {
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

    const handleGerarRelatorio = () => {
        setBotaoClicado(opcRelatorio);
        if (isFormValid) {
            setDadosFiltroRelatorioGerado({ dataInicial, dataFinal, opcFiltro, objDoador, objPaciente });

            if (opcRelatorio == 'Saldo de estoque') {
                setData("loading")
                serverFunctions.relatorioSaldoDeEstoque().then(string => {
                    const dataFromBack = JSON.parse(string);

                    setData(dataFromBack);

                    console.log(dataFromBack)


                    // if (Array.isArray(dataFromBack) && dataFromBack.length > 0) {
                    //     const listaOrdenada = dataFromBack.slice().sort((a, b) => {
                    //         const nomeA = a[Object.keys(a)[0]]['nome']?.toUpperCase() || '';
                    //         const nomeB = b[Object.keys(b)[0]]['nome']?.toUpperCase() || '';
                    //         if (nomeA < nomeB) {
                    //             return -1;
                    //         } else if (nomeA > nomeB) {
                    //             return 1;
                    //         } else {
                    //             return 0;
                    //         }
                    //     });
                    //     setData(listaOrdenada);
                    // } else {
                    //     setData(dataFromBack);
                    // }
                }).catch(alert);

            } else if (opcRelatorio == 'Saída de medicamentos') {
                setData('loading');
                var valueChavePaciente = '';
                if (objPaciente != null) {
                    valueChavePaciente = objPaciente.value
                }
                serverFunctions.relatorioSaidaMedicamento(dataInicial, dataFinal, opcFiltro, valueChavePaciente).then(string => {
                    const data = JSON.parse(string);
                    setData(data);

                    console.log(data)

                    // if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
                    //     const listaOrdenada = ordenarListaPorCampo(data, "nome");
                    //     setData(listaOrdenada);
                    // } else {
                    //     setData(data);
                    // }
                }).catch(alert);

                setOpcFiltroVisualizacao(opcFiltro);
                setDataInicialVisualizacao(dataInicial);
                setDataFinalVisualizacao(dataFinal);

            } else if (opcRelatorio == 'Entrada de medicamentos') {
                setData('loading');
                var valueChaveDoador = '';
                if (objDoador !== null) {
                    valueChaveDoador = objDoador.value
                }
                serverFunctions.relatorioEntradaMedicamento(dataInicial, dataFinal, opcFiltro, valueChaveDoador).then(string => {
                    const data = JSON.parse(string);
                    setData(data);

                    console.log(data)

                    // if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
                    //     const listaOrdenada = ordenarListaPorCampo(data, "nome");
                    //     setData(listaOrdenada);
                    // } else {
                    //     setData(data);
                    // }
                }).catch(alert);

                setOpcFiltroVisualizacao(opcFiltro);
                setDataInicialVisualizacao(dataInicial);
                setDataFinalVisualizacao(dataFinal);
            }
        } else {
            setMsgDataErrada(true);
        }
    }

    function renderBuscarPaciente() {
        var listaPacientes = [{ value: "Todos", label: "Todos" }];

        if (dataPacientes != null) {
            if (Object.keys(dataPacientes).length > 0) {
                dataPacientes.map((event: Paciente, index) => {
                    listaPacientes.push({ value: event.chavePaciente, label: `${event.nome} | ${formatarDataParaVisualizacao(event.dataNascimento)} | ${event.cpf}` });
                })
            }
        }

        if (opcFiltro === 'Paciente') {
            return (
                <Col sm={4}>
                    <InputReactSelect label={"Selecione o paciente"} lista={listaPacientes} data={objPaciente} setData={setObjPaciente} />
                </Col>
            )
        }
    }

    function renderBuscarDoador() {
        var listaDoador = [{ value: "Todos", label: "Todos" }];

        if (dataDoadores != null) {
            if (Object.keys(dataDoadores).length > 0) {
                dataDoadores.map((event: Doador, index) => {
                    listaDoador.push({ value: event.chaveDoador, label: gerarLabelDoador(event) });
                })
            }
        }

        if (opcFiltro === 'Doação') {
            return (
                <Col sm={4}>
                    <InputReactSelect label={"Selecione o doador"} lista={listaDoador} data={objDoador} setData={setObjDoador} />
                </Col>
            )
        }
    }

    function renderAlertaErro() {
        if (msgDataErrada) {
            return (
                <Row className='mt-3'>
                    <Col>
                        <p className="texto-fino textoVermelho noMaginPadin d-flex justify-content-center">
                            Preencha todos os campos corretamente!
                        </p>
                    </Col>
                </Row>
            )
        }
    }

    function renderDescricaoSaidaPaciente() {
        if (opcFiltroVisualizacao == 'Paciente') {
            return (
                <Row>
                    <Col>
                        <h6>Paciente: {dadosFiltroRelatorioGerado.objPaciente.label}</h6>
                    </Col>
                </Row>
            )
        }
    }

    function renderDescricaoEntradaDoador() {
        if (opcFiltroVisualizacao == 'Doação') {
            return (
                <Row>
                    <Col >
                        <h6>Doador: {dadosFiltroRelatorioGerado.objDoador.label}</h6>
                    </Col>
                </Row>
            )
        }
    }

    function renderNomeMedicamento(nome, principioAtivo, apresentacao) {
        const nomeNegrito = <text style={{fontWeight: "550"}}>{nome}</text>

        return (
            <div>
                {nomeNegrito}, {principioAtivo}, {apresentacao}
            </div>
        );

    }

    function renderTable() {
        if (data == null) {
            return (
                <Alert key={"infoTabela"} variant={"warning"} className='d-flex justify-content-center'>
                    Selecione uma opção e clique em "Gerar Relatório".
                </Alert>
            )
        } else if (data == 'loading') {
            return (
                <div className='d-flex justify-content-center'>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )
        } else if (data == false) {
            return (
                <Alert key={"infoTabela"} variant={"info"}>
                    Não há informações para os dados informados.
                </Alert>
            )
        } else {

            if (botaoClicado == 'Saldo de estoque') {
                return (
                    <>
                        {/* <Row className='mb-3'>
                            <Col sm={5} className=' d-flex justify-content-center align-items-center'>
                                <h4>Relatório - Saldo de estoque</h4>
                            </Col>
                            <Col sm={7} className=' d-flex justify-content-center align-items-center'>

                                <InputGroup className='buscar'>
                                    <Form.Control
                                        placeholder={"Busque pelo nome ou princípio ativo"}
                                        aria-label={"nome ou nascimento"}
                                        aria-describedby="basic-addon2"
                                        value={busca}
                                        onChange={(ev) => setBusca(ev.target.value)}
                                    />
                                    <InputGroup.Text>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                </InputGroup>
                            </Col>
                        </Row> */}

                        <Row>
                            <Col className=' d-flex justify-content-center align-items-center'>
                                <h4>Relatório referente ao saldo de estoque</h4>
                            </Col>
                        </Row>

                        <hr></hr>

                        <Row className='d-flex justify-content-center mt-2 mb-3'>
                            <Col md={4} className='d-flex justify-content-center'>
                                <Button variant="outline-secondary" onClick={handleGerarPDF}>
                                    Gerar PDF
                                </Button>
                            </Col>
                        </Row>

                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }} >Medicamento</th>
                                    <th style={{ width: '30%' }} >Princípio ativo</th>
                                    <th style={{ width: '15%' }} >Apresentação</th>
                                    <th style={{ width: '10%' }} >Quantidade</th>
                                    <th style={{ width: '20%' }} >Usuário</th>

                                </tr>
                            </thead>
                            <tbody>
                                <>
                                    {data ? data.map((objeto) => {
                                        const id = Object.keys(objeto)[0]; // Obtém o ID do objeto
                                        const remedio = objeto[id]; // Obtém o objeto de remédio associado ao ID

                                        return busca.toLowerCase() === '' ||
                                            remedio.nome.toLowerCase().includes(busca.toLowerCase()) ||
                                            remedio.principioAtivo.toLowerCase().includes(busca.toLowerCase()) ? (
                                            <tr key={id}>
                                                <td>{remedio.nome}</td>
                                                <td>{remedio.principioAtivo}</td>
                                                <td>{remedio.apresentacao}</td>
                                                <td>{remedio.quantidade}</td>
                                                <td>{remedio.nomeUsuario}</td>
                                            </tr>
                                        ) : null;
                                    }) : ''}
                                </>
                            </tbody>
                        </Table>
                    </>

                )
            } else if (botaoClicado == 'Saída de medicamentos') {
                return (
                    <>
                        {/* <Row className='d-flex justify-content-center align-items-center mb-3 mt-4'>
                            <Col md={6} >
                                <InputGroup className='buscar'>
                                    <Form.Control
                                        placeholder={"Busque pelo nome ou princípio ativo"}
                                        aria-label={"nome ou nascimento"}
                                        aria-describedby="basic-addon2"
                                        value={busca}
                                        onChange={(ev) => setBusca(ev.target.value)}
                                    />
                                    <InputGroup.Text>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                </InputGroup>
                            </Col>
                        </Row> */}

                        <Row className='mt-4'>
                            <Col className=' d-flex justify-content-center align-items-center'>
                                <h4>Relatório referente a saída de medicamentos</h4>
                            </Col>
                        </Row>

                        <hr></hr>

                        <Row className='mt-2'>
                            <Col>
                                <h6>Filtro: {opcFiltroVisualizacao}</h6>
                            </Col>
                        </Row>

                        {renderDescricaoSaidaPaciente()}

                        <Row>

                            <Col>
                                <h6>Data inicial: {formatarDataParaVisualizacao(dataInicialVisualizacao)}</h6>
                            </Col>
                        </Row>
                        <Row className='b-2'>
                            <Col>
                                <h6>Data final: {formatarDataParaVisualizacao(dataFinalVisualizacao)}</h6>
                            </Col>
                        </Row>

                        <hr></hr>

                        <Row className='d-flex justify-content-center mt-2 mb-3'>
                            <Col md={2} className=''>
                                <Button variant="outline-secondary" onClick={handleGerarPDF}>
                                    Gerar PDF
                                </Button>
                            </Col>
                        </Row>


                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th style={{ width: '10%' }} >Data de saída</th>
                                    <th style={{ width: '25%' }} >Medicamento</th>
                                    <th style={{ width: '25%' }} >Princípio ativo</th>
                                    <th style={{ width: '10%' }} >Apresentação</th>
                                    <th style={{ width: '10%' }} >Quantidade</th>
                                    <th style={{ width: '20%' }} >Usuário</th>
                                </tr>
                            </thead>
                            <tbody>
                                <>
                                    {data ? data.filter((item) => {
                                        return busca.toLowerCase() === '' ||
                                            item.nome.toLowerCase().includes(busca.toLowerCase()) ||
                                            item.principioAtivo.toLowerCase().includes(busca.toLowerCase());
                                    }).map((item, index) => {
                                        const { dataOperacao, nome, principioAtivo, apresentacao, novaQuantidade, quantidadeAnterior, chaveUsuario, nomeUsuario } = item;
                                        console.log(item)
                                        const quantidadeCalculada = parseInt(quantidadeAnterior) - parseInt(novaQuantidade);

                                        return (
                                            <tr key={index}>
                                                <td>{formatarDataParaVisualizacao(dataOperacao)}</td>
                                                <td>{nome}</td>
                                                <td>{principioAtivo}</td>
                                                <td>{apresentacao}</td>
                                                <td>{quantidadeCalculada}</td>
                                                <td>{nomeUsuario}</td>
                                            </tr>
                                        );
                                    }) : ''}
                                </>
                            </tbody>
                        </Table>

                    </>

                )
            } else if (botaoClicado == 'Entrada de medicamentos') {
                return (
                    <>
                        <Row className='mb-2'>
                            <Col className=' d-flex justify-content-center align-items-center'>
                                <h4>Relatório referente a entrada de medicamentos</h4>
                            </Col>
                        </Row>

                        <hr></hr>

                        <Row className='mt-2'>
                            <Col>
                                <h6>Filtro: {opcFiltroVisualizacao}</h6>
                            </Col>
                        </Row>

                        {renderDescricaoEntradaDoador()}

                        <Row>
                            <Col >
                                <h6>Data inicial: {formatarDataParaVisualizacao(dataInicialVisualizacao)}</h6>
                            </Col>
                        </Row>

                        <Row className='mb-2'>
                            <Col >
                                <h6>Data final: {formatarDataParaVisualizacao(dataFinalVisualizacao)}</h6>
                            </Col>
                        </Row>

                        <hr></hr>

                        <Row className='d-flex justify-content-center mt-2 mb-3'>
                            <Col md={2} className=''>
                                <Button variant="outline-secondary" onClick={handleGerarPDF}>
                                    Gerar PDF
                                </Button>
                            </Col>
                        </Row>

                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th style={{ width: '8%' }} >Entrada</th>
                                    <th style={{ width: '30%' }} >Medicamento</th>
                                    <th style={{ width: '5%' }} >Entrou</th>
                                    <th style={{ width: '25%' }} >Doador</th>
                                    <th style={{ width: '10%' }} >Nascimento</th>
                                    <th style={{ width: '22%' }} >Usuário</th>
                                </tr>
                            </thead>
                            <tbody>
                                <>
                                    {data ? data.filter((item) => {
                                        return busca.toLowerCase() === '' ||
                                            item.nome.toLowerCase().includes(busca.toLowerCase()) ||
                                            item.principioAtivo.toLowerCase().includes(busca.toLowerCase());
                                    }).map((item, index) => {
                                        const { dataOperacao, nome, principioAtivo, apresentacao, novaQuantidade, quantidadeAnterior, chaveUsuario, nomeUsuario } = item;
                                        const quantidadeCalculada = parseInt(novaQuantidade) - parseInt(quantidadeAnterior);

                                        return (
                                            <tr key={index}>
                                                <td>{formatarDataParaVisualizacao(dataOperacao)}</td>
                                                <td>{renderNomeMedicamento(nome, principioAtivo, apresentacao)}</td>
                                                <td>{quantidadeCalculada}</td>
                                                <td>{"Fulano de Tal souza almeida"}</td>
                                                <td>{formatarDataParaVisualizacao(dataOperacao)}</td>
                                                <td>{nomeUsuario}</td>
                                            </tr>
                                        );
                                    }) : ''}
                                </>
                            </tbody>
                        </Table>
                    </>

                )

            }
        }
    }

    function ordenarListaPorCampo(lista, campo) {
        return lista.slice().sort((a, b) => {
            const valorA = a[campo]?.toUpperCase() || '';
            const valorB = b[campo]?.toUpperCase() || '';
            if (valorA < valorB) {
                return -1;
            } else if (valorA > valorB) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    function renderCampoData() {
        return (
            <>
                <Col md={3}>
                    <Row className='noPaddingNoMargin'>
                        <Form.Label><h6>Data inicial</h6></Form.Label>
                        <Form.Group controlId={'inputDataInicial'}>
                            <Form.Control
                                type={"date"}
                                name={'dataInicial'}
                                value={dataInicial}
                                onChange={(e) => setDataInicial(e.target.value)} />
                        </Form.Group>
                    </Row>


                </Col>

                <Col md={3}>
                    <Row className='noPaddingNoMargin'>
                        <Form.Label><h6>Data final</h6></Form.Label>
                        <Form.Group controlId={'inputDataFinal'}>
                            <Form.Control
                                type={"date"}
                                min={dataInicial}
                                name={'dataFinal'}
                                value={dataFinal}
                                onChange={(e) => setDataFinal(e.target.value)} />
                        </Form.Group>
                    </Row>
                </Col>
            </>
        )
    }

    function renderOpcoesAdicionais() {
        if (opcRelatorio == "Entrada de medicamentos") {
            return (
                <>
                    <hr></hr>
                    <Row className='d-flex justify-content-center pt-2 pb-2 '>

                        <Col sm={4}>
                            <Form.Label><h6 >Tipo</h6></Form.Label>
                            <Form.Select
                                value={opcFiltro}
                                onChange={(e) => setOpcFiltro(e.target.value)}>
                                {(infoDD ? infoDD[16] : [])?.map((info) =>
                                    <option key={info} value={info}>{info}</option>
                                )}
                            </Form.Select>
                        </Col>

                        {renderCampoData()}

                        <Col md={2} className='d-flex justify-content-center align-items-end'>
                            <Button variant="dark" onClick={handleGerarRelatorio}>
                                Gerar Relatório
                            </Button>
                        </Col>
                    </Row>

                    <Row className='mt-3'>
                        {renderBuscarDoador()}
                    </Row>

                    {renderAlertaErro()}

                </>
            )
        } else if (opcRelatorio == "Saída de medicamentos") {
            return (
                <>
                    <hr></hr>
                    <Row className='d-flex justify-content-center pt-2 pb-2 '>

                        <Col sm={4}>
                            <Form.Label><h6 >Tipo</h6></Form.Label>
                            <Form.Select
                                value={opcFiltro}
                                onChange={(e) => setOpcFiltro(e.target.value)}>
                                {(infoDD ? infoDD[17] : [])?.map((info) =>
                                    <option key={info} value={info}>{info}</option>
                                )}
                            </Form.Select>
                        </Col>

                        {renderCampoData()}

                        <Col md={2} className='d-flex justify-content-center align-items-end'>
                            <Button variant="dark" onClick={handleGerarRelatorio}>
                                Gerar Relatório
                            </Button>
                        </Col>
                    </Row>

                    <Row className='mt-3'>
                        {renderBuscarPaciente()}
                    </Row>

                    {renderAlertaErro()}

                </>
            )
        } else if (opcRelatorio == "Saldo de estoque") {
            return (
                <>
                    <hr></hr>
                    <Row className='mb-2'>
                        <Col className='d-flex justify-content-center align-items-center'>
                            <Button variant="dark" onClick={handleGerarRelatorio}>
                                Gerar Relatório
                            </Button>
                        </Col>
                    </Row>

                </>
            )
        }
    }

    useEffect(() => {
        serverFunctions.getInformacoesSelect().then(string => { setInfoDD(JSON.parse(string)) }).catch(alert);
        serverFunctions.getConfiguracoes().then(dados => { setDadosConfig(JSON.parse(dados)) }).catch(alert);

        serverFunctions.getPacientes().then(dadosPaciente => { setDataPacientes(JSON.parse(dadosPaciente)) }).catch(alert);
        serverFunctions.getDoadores().then(dadosDoadores => { setDataDoadores(JSON.parse(dadosDoadores)) }).catch(alert);
    }, []);

    useEffect(() => {
        if (dadosConfig != null) {
            var primeiraData = dadosConfig[0].dataInicial.split('T')[0];
            setDataInicial(primeiraData);
        }
    }, [dadosConfig]);

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        const isDataValid = dataInicial !== '' && dataFinal !== '' && dataInicial !== null && dataFinal !== null;
        const isPacienteValid = opcFiltro === 'Paciente' ? objPaciente !== null : true;
        const isDoacaoValid = opcFiltro === 'Doação' ? objDoador !== null : true;

        if (opcRelatorio === 'Entrada de medicamentos' && isDataValid && isDoacaoValid) {
            setIsFormValid(true);
            setMsgDataErrada(false);
        } else if (opcRelatorio === 'Saída de medicamentos' && isDataValid && isPacienteValid) {
            setIsFormValid(true);
            setMsgDataErrada(false);
        } else if (opcRelatorio === 'Saldo de estoque') {
            setIsFormValid(true);
            setMsgDataErrada(false);
        } else {
            setIsFormValid(false);
        }
    }, [opcRelatorio, dataInicial, dataFinal, opcFiltro, objDoador, objPaciente]);

    const imgUrl = 'https://drive.google.com/uc?id=16w37OmWjBmHXN8aWdYud1wQYAJt__jnP';

    // fetch(imgUrl)
    //     .then((response) => {
    //         if (!response.ok) {
    //             throw new Error('Não foi possível carregar a imagem');
    //         }
    //         return response.arrayBuffer();
    //     })
    //     .then((imagemArrayBuffer) => {
    //         const base64Image = btoa(new Uint8Array(imagemArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    //         const dataUri = `data:image/png;base64,${base64Image}`;

    //         setDataUriImg(dataUri)
    //     })
    //     .catch((error) => {
    //         console.error('Erro ao carregar a imagem:', error);
    //     });





    return (
        <section className='margemNavBar ms-5 me-5'>
            <Card style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                <Card.Header style={{ position: 'sticky', top: '0', backgroundColor: '#f8f8f8', zIndex: '1' }}>
                    <Container fluid>
                        <Row className='d-flex justify-content-between'>
                            <Col md={6} className='d-flex justify-content-center align-items-center pt-2'>
                                <h5 className='noPaddingNoMargin'>Relatórios</h5>
                            </Col>

                            <Col md={6}>
                                <Row className='d-flex justify-content-center align-items-center pt-2'>
                                    <Col md={8} className='noPaddingNoMargin'>
                                        <InputSelect required={true} label={""} name={"opcRelatorio"} data={opcRelatorio} setData={setOpcRelatorio} lista={infoDD ? infoDD[15] : []} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {renderOpcoesAdicionais()}
                    </Container>


                </Card.Header>
                <Card.Body>
                    {renderTable()}
                </Card.Body>
            </Card>
        </section>
    )
}
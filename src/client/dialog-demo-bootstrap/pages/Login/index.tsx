import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';


import { Container } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';

import gerarHashCode from '../../Functions/gerarHashCode';
import InputCpf from "../../components/InputCpf";
import InputText from "../../components/InputText";
import { serverFunctions } from '../../../utils/serverFunctions';
import UserContext from "../../contexts/user/context";


import './login.css';


export default function Login() {

    // const {globalVariable, setGlobalVariable} = useContext(GlobalContext);
    const { setState: setGlobalState } = useContext(UserContext);

    // const {nome} = useContext(GlobalContext);

    const imgUrl = "https://drive.google.com/uc?export=view&id=1CH-FM3Sp24gjoLwM1em0qaegJdMd2LSM";

    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(false);
    const handleClick = () => setLoading(true);

    // Login
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');

    // Mensagem de erro:
    const [mensagem, setMensagem] = useState(false);
    const [mensagemErroBack, setMensagemErroBack] = useState(false);

    function handleSubmitContext(chaveUsuario, nome, matricula, cpf, email, tipoUsuario) {
        setGlobalState({ chaveUsuario, nome, matricula, cpf, email, tipoUsuario });
    }

    function renderMensagemLoginInvalido() {
        if (mensagem) {
            return (
                <Row>
                    <Col>
                        <p className="texto-fino textoVermelho noMaginPadin d-flex justify-content-center">Credenciais incorretas. </p>
                    </Col>
                </Row>
            )
        }
    }

    function renderMensagemErroBack() {
        if (mensagemErroBack) {
            return (
                <Row>
                    <Col>
                        <p className="texto-fino textoVermelho d-flex justify-content-center">Erro. Comunique o administrador!</p>
                    </Col>
                </Row>
            )
        }
    }

    useEffect(() => {

        const hashSenha = gerarHashCode(senha);

        var dadosLogin = {
            cpf,
            hashSenha
        }

        if (isLoading) {
            setMensagem(false);
            setMensagemErroBack(false);

            serverFunctions.validarCredenciais(dadosLogin).then((sucesso) => {

                // mandar isso aqui para pagina padrão
                var dados = JSON.parse(sucesso);

                if (dados) {
                    navigate('/home');
                    handleSubmitContext(dados.chaveUsuario, dados.nome, dados.matricula, dados.cpf, dados.email, dados.tipoUsuario);
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



    return (
        <section className="border pageBackground" style={{ height: "100vh", width: "100%" }}>

            <Container className="child pe-5 ps-5">
                <Row className="d-flex justify-content-center pt-4 pb-4">
                    <img
                        src={imgUrl}
                        className="d-inline-block align-top imagem noMaginPadin"
                        alt="React Bootstrap logo"
                    />
                </Row>

                <Row className="mb-3">
                    <Col>
                        <p className="texto-fino">Bem vindo novamente. Por gentileza realize o Login em sua conta!</p>

                    </Col>
                </Row>
                <Col>
                    <InputCpf label={"CPF"} placeholder={""} controlId={"inputCpf"} name={"cpf"} data={cpf} setData={setCpf} />

                </Col>
                <Row>
                    <Col>
                        <InputText type={"password"} required={true} label={"Senha"} placeholder={""} controlId={"inputSenha"} name={"nome"} data={senha} setData={setSenha} />
                    </Col>
                </Row>

                {renderMensagemLoginInvalido()}


                <Row className="d-flex justify-content-center p-3">
                    {/* <Button variant="outline-primary" className="corBotao tamanhoBotaoPequeno" onClick={handleNavigateHome}>
                        Entrar
                    </Button> */}

                    <Button
                        type="submit"
                        variant="outline-primary"
                        className="corBotao tamanhoBotaoPequeno"
                        disabled={isLoading}
                        onClick={!isLoading ? handleClick : null}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </Row>

                {renderMensagemErroBack()}

            </Container>
        </section>

    )
}
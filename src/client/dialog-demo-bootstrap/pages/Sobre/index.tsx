import CardGroup from 'react-bootstrap/CardGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import React from 'react';

import '../style.css'
import Cardes from './Cardes';


export default function Sobre() {

    const imgCaleo = 'https://drive.google.com/uc?export=view&id=168LHuHXIjsmfOcbMU2M8HokShk2MRbvF';
    const imgJoao = 'https://drive.google.com/uc?export=view&id=1ZVxLm4UYTiphzYBjRK8_Req3J1cEXoJj';
    const imgTinin = 'https://drive.google.com/uc?export=view&id=1Ff_429EOcDw1a9hzwtPWpMVz2qgrPWBw';


    return (
        <section className='margemNavBar ms-5 me-5'>

            <div>
                <h3 className='d-flex justify-content-center'>
                    Nosso objetivo
                </h3>
                <p>
                    A Farmácia Universitária (FU) da UEFS realiza vários serviços farmacêuticos e, no processo de assistência à comunidade, foi motivada a pensar um novo serviço, a farmácia solidária. Esta atividade consiste na recepção, triagem e doação de medicamentos em condições de uso  para que sejam reutilizados por outras pessoas conforme a necessidade e prescrição de profissional habilitado (médico, dentista ou farmacêutico).
                    <br/>
                    <br/>
                    Ocorre que esses medicamentos nem sempre integram o elenco já disponibilizado pelo Sistema Único de Saúde, de modo que não podem ser inseridos no sistema de gestão de medicamentos (IDC Saúde) da Secretaria Municipal de Saúde, utilizado também na FU. Sendo assim, faz-se necessário o uso de um sistema próprio capaz de gerenciar o estoque destes medicamentos.
                </p>
            </div>

            <section className='margemTop'>
                <h5 className='d-flex justify-content-center'>
                    Equipe de desenvolvimento
                </h5>
                <CardGroup className='mt-5'>
                    <Container>
                        <Row className=''>
                            <Col md={4} className='d-flex justify-content-center mb-3'>
                                <Cardes titulo={"Caleo Silva"} descricao={"Desenvolvedor"} urlImg={imgCaleo} />
                            </Col>

                            <Col md={4} className='d-flex justify-content-center mb-3'>
                                <Cardes titulo={"Carlos Tinin"} descricao={"Desenvolvedor"} urlImg={imgTinin} />
                            </Col>

                            <Col md={4} className='d-flex justify-content-center mb-3'>
                                <Cardes titulo={"João Batista"} descricao={"Coordenador"} urlImg={imgJoao} />
                            </Col>
                        </Row>
                    </Container>
                </CardGroup>
            </section>




        </section>
    )
}
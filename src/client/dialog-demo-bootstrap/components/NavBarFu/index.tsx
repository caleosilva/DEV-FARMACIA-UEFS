import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';

import './navbar.css';
import React from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../contexts/user/context';
import { Navigate } from 'react-router-dom';


const NavBarFU = () => {

  const { setState, state } = useContext(UserContext);

  const navigate = useNavigate();

  const [dadosUser, setDadosUser] = useState(null);

  const rotas = [{
    label: 'Home',
    to: '/home'
  }, {
    label: 'Medicamentos',
    to: '/medicamentos'
  }, {
    label: 'Doadores',
    to: '/doadores'
  }, {
    label: 'Pacientes',
    to: '/pacientes'
  }, {
    label: 'Sobre',
    to: '/sobre'
  }, {
    label: 'Perfil',
    to: '/perfil'
  }, {
    label: 'Sair',
    to: '/login'
  }];

  const imgUrl = 'https://drive.google.com/uc?export=view&id=16w37OmWjBmHXN8aWdYud1wQYAJt__jnP';

  useEffect(() => {
    if (state.chaveUsuario.length == 0) {
      <Navigate to='/acessoNegado' replace />
    }
  }, [state])

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed='top' className=''>
        <Container fluid>
          {/* <Navbar.Brand>
            <Link to={'/home'} style={{ textDecoration: 'none', color: 'white' }}>
              <img
                src={imgUrl}
                width="30"
                height="30"
                className="d-inline-block align-top me-2"
                alt="React Bootstrap logo"
              />
              {"Farmácia Universitária"}
            </Link>
          </Navbar.Brand> */}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" />
            <Nav>
              {rotas.map((rota, index) => (
                <Nav.Item key={index} >
                  <Nav.Link >
                    <Link to={rota.to} className='itemNavbar'>
                      {rota.label}
                    </Link>
                  </Nav.Link>
                </Nav.Item>
              ))}

              {/* <Nav.Item className='d-flex align-items-center'>
                <Link to='/login' className='itemNavbar'>
                  Sair
                </Link>
              </Nav.Item> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBarFU;
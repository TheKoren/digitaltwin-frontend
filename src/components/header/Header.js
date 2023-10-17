import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNetworkWired } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import './header.css'

const Header = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg">
        <Container fluid>
            <Navbar.Brand href="/" style={{"color": 'black'}}>
                <FontAwesomeIcon icon={faNetworkWired}/> DigitalTwin
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll"/>
            <Navbar.Collapse id="navbarScroll">
                <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{maxHeight: '100px'}}
                    navbarScroll
                    >
                        <NavLink className ="nav-link" to="/">Home</NavLink>
                        <NavLink className ="nav-link" to="/topology">Topology</NavLink>
                        <NavLink className ="nav-link" to="/analysis">Analysis</NavLink>
                </Nav>
            </Navbar.Collapse>

        </Container>
    </Navbar>
  )
}

export default Header
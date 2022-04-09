import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";

export default function NavbarMenu() {
  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/">DeFund</Navbar.Brand>
          <Nav className="me-end">
            <Nav.Link href="/create">Create Campaign</Nav.Link>
            <Nav.Link href="#features">About Us</Nav.Link>
            <Nav.Link href="#pricing">Contact us</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

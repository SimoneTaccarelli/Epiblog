import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';

function MyNavbar() {
  const { user, logout } = useAuth();
  console.log('userNav',user );

  const defaultImg = `https://ui-avatars.com/api/?background=8c00ff&color=fff&name=${user?.firstName}+${user?.lastName}`;

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">EpiBlog</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Link to="/" className="nav-link">Home</Link>
          </Nav>
          {user  ? (
            <>
              <NavDropdown
                className="ms-auto"
                id="nav-dropdown"
                title={
                  <>
                    <Image
                      src={user?.profilePic || defaultImg}
                      alt="Avatar"
                      roundedCircle
                      style={{ objectFit: "cover" }}
                      width="30"
                      height="30"
                      className="me-2"
                    />
                    {"Welcome " + user?.firstName + " " + user?.lastName}
                  </>
                }
                data-bs-theme="light"
              >
                <Link to="/MyProfile" 
                className="dropdown-item">My Profile</Link>
                <NavDropdown.Item href="#/action-3">Something else</NavDropdown.Item>
                <NavDropdown.Divider />
                <Link to="/" onClick={logout} className="dropdown-item">Logout</Link>
              </NavDropdown>
            </>
          ) : (
            <Link to="/login" className="btn btn-link text-center">Login</Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
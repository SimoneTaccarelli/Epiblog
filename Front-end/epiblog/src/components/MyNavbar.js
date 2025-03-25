import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';

function MyNavbar() {
  const { user, logout } = useAuth();
  console.log('userNav', user);

  const defaultImg = `https://ui-avatars.com/api/?background=8c00ff&color=fff&name=${user?.firstName}+${user?.lastName}`;

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">EpiBlog</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {user ? (
            <>
              <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                <Link to="/" className="nav-link">Home</Link>
              </Nav>
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
                <Link to="/Settings"
                  className='dropdown-item'>Settings</Link>
                <NavDropdown.Divider />
                <Link to="/login" onClick={logout} className="dropdown-item">Logout</Link>
              </NavDropdown>
            </>
          ) : (
            <Link to="/login" className="login-btn text-center">Login</Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
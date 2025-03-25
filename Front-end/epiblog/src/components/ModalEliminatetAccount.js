import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_URL } from '../config/config';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

function ModalEliminatetAccount() {
  const [show, setShow] = useState(false);
  const { user, logout } = useAuth();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const passwordData = {
      password : password,
    };
    try {
      const res = await axios.delete(`${API_URL}/auth/${user._id}`, {
        data: { password },
      });
      alert(res.data.message);
      logout();
      navigate('Login /');
    }
    catch (error) {
      alert(error.response.data.message);
    }
  }




    return (
      <>
        <Button
          variant="Link"
          onClick={handleShow}
          className="settingsButton">
          <i class="bi bi-person-fill-x"></i>Delet Account
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>insert the password to delet your account</Modal.Title>
          </Modal.Header>
          <Form
            onSubmit={handleDelete}>
            <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="password"
                                name="password"
                                value={password.oldPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">Delet account</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }

  export default ModalEliminatetAccount;
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
  
  // Controlla se l'utente si è autenticato tramite Google
  const isGoogleUser = user?.provider === 'google' || user?.googleId;

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    
    try {
      // Chiamata API diversa a seconda del tipo di utente
      let res;
      if (isGoogleUser) {
        res = await axios.delete(`${API_URL}/auth/google/${user._id}`);
      } else {
        res = await axios.delete(`${API_URL}/auth/${user._id}`, {
          data: { password }
        });
      }
      
      alert(res.data.message);
      logout();
      navigate('/login');
    }
    catch (error) {
      alert(error.response?.data?.message || 'Errore durante l\'eliminazione dell\'account');
    }
  };

  return (
    <>
      <Button variant="Link" onClick={handleShow} className="settingsButton">
        <i className="bi bi-person-fill-x"></i>Elimina Account
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {isGoogleUser 
              ? 'Conferma eliminazione account Google' 
              : 'Inserisci la password per eliminare il tuo account'}
          </Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleDelete}>
          <Modal.Body>
            {isGoogleUser ? (
              <p>Sei sicuro di voler eliminare il tuo account Google? Questa azione è irreversibile.</p>
            ) : (
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Inserisci la tua password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Annulla
            </Button>
            <Button variant="danger" type="submit">
              {isGoogleUser ? 'Conferma eliminazione' : 'Elimina account'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default ModalEliminatetAccount;
import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModifyModal({ id, handleName }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const nameRef = useRef(null);
  const lastNameRef = useRef(null);

  const handleModify = () => {
    handleName(nameRef.current.value);
  };

  const Modify = () => {
    fetch(`http://localhost:4000/api/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: nameRef.current.value, lastName: lastNameRef.current.value }),
    })
    .then((res) => res.json())
    .then((data) => console.log('i dati sono stati caricati con successo! ', data))
    .catch((error) => {
      console.error('Errore: ', error);
    });
  };

  const handleSaveChanges = () => {
    handleClose();
    handleModify();
    Modify();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Modify
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input 
            type="text" 
            placeholder="New name" 
            ref={nameRef}
          />
          <input
            type="text" 
            placeholder="New last name" 
            ref={lastNameRef}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModifyModal;
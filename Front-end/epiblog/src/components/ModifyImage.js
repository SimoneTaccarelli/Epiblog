import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';  
import { useAuth } from '../contexts/AuthContext';
import { Container } from 'react-bootstrap';

function ModifyImage() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [previewImage, setPreviewImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const { user, setUser } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Funzione per gestire il cambiamento dell'immagine di copertina
    const handleImageChange = (e) => {
        // Ottiene il file dell'immagine di copertina
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file); // Imposta il file dell'immagine di copertina
            setPreviewImage(URL.createObjectURL(file)); // Imposta l'anteprima dell'immagine di copertina
        }
    };

    const ModifyPic = async (e) => {
        e.preventDefault();

        if (!coverImage) {
            setError("Please select an image to upload.");
            return;
        }

        const newProfilPic = new FormData();
        newProfilPic.append('profilePic', coverImage);

        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:4000/users/${user._id}`, newProfilPic, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response);
            console.log(response.data);

            if (response.data) {
                setUser(response.data);
            }

            setLoading(false);
            handleClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            setError(error.response?.data?.message || "Error updating profile");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }


    return (
        <>
           <div variant="primary" className="modPicUs" onClick={handleShow}>
                <i className="bi bi-pencil-square"></i>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Mostra il messaggio di errore se c'è un errore */}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={ModifyPic}>
                        <h5>Profile Pic</h5>
                        <Form.Group className="mb-3" controlId="profilePic">
                            <Form.Label>Upload new profile picture</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                            {previewImage && (
                                <img src={previewImage} alt="Profile Preview" className="mt-2" style={{ width: "200px", borderRadius: "10px" }} />
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose && ModifyPic}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModifyImage;
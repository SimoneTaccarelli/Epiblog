import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';
import { useState } from 'react';
import { Container, Spinner, Button, Modal, Alert, Form } from "react-bootstrap";
import '../Style/PP.css';

function ModifyImage() {
    const { user, setUser } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

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
            {/* Pulsante per aprire il modal */}
            <div variant="primary" className="modPicUs" onClick={handleShow}>
                <i className="bi bi-pencil-square"></i>
            </div>

            {/* Modal per modificare il profilo */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify pic profile</Modal.Title>
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
                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModifyImage;
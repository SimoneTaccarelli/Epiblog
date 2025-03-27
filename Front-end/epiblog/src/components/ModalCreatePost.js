import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/config';

// Definizione del componente ModalCreatePost
function ModalCreatePost({ updatePost }) {
    // Stato per gestire la visibilità del modal
    const [show, setShow] = useState(false);

    // Stato per gestire i dati del nuovo post
    const [post, setPost] = useState({
        title: "",
        category: "",
        cover: "",
        description: "",
        readTime: {
            value: "",
            unit: "minuti"
        }
    });

    // Stato per gestire l'immagine di copertina
    const [coverImage, setCoverImage] = useState(null);

    // Stato per gestire l'anteprima dell'immagine di copertina
    const [previewImage, setPreviewImage] = useState('');

    // Hook per ottenere le informazioni sull'utente autenticato
    const { user } = useAuth();

    // Stato per gestire eventuali errori
    const [error, setError] = useState("");

    // Hook per navigare tra le pagine
    const navigate = useNavigate();

    // Funzione per chiudere il modal
    const handleClose = () => setShow(false);

    // Funzione per aprire il modal
    const handleShow = () => setShow(true);

    // Funzione per gestire il cambiamento dell'immagine di copertina
    const handleImageChange = (e) => {
        // Ottiene il file dell'immagine di copertina
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file); // Imposta il file dell'immagine di copertina
            setPreviewImage(URL.createObjectURL(file)); // Imposta l'anteprima dell'immagine di copertina
        }
    };

    // Funzione per gestire l'invio del form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene il comportamento predefinito del form
        try {
            // Controlla se l'utente è autenticato
            if (!user || !user._id) {
                throw new Error("User not logged in");
            }

            // Crea un oggetto FormData per inviare i dati del post
            const postdata = new FormData();
            postdata.append("title", post.title);
            postdata.append("category", post.category);
            postdata.append("description", post.description);
            postdata.append("readTime", JSON.stringify(post.readTime));
            postdata.append("author", user._id);
            postdata.append("cover", coverImage); // Aggiunge l'immagine di copertina al FormData

            // Invia una richiesta POST al server per creare un nuovo post
            try {
                const response = await axios.post(`${API_URL}/posts`, postdata, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                // Se la risposta è OK, tutto bene
                if (response && response.data) {
                    updatePost();
                    handleClose();
                    navigate("/");
                }
            } catch (error) {
                // Anche in caso di errore, verifica se il post è stato creato
                console.log("Errore nella risposta, ma il post potrebbe essere stato creato");
                updatePost(); // Aggiorna comunque la lista dei post
                handleClose();
                navigate("/");
            }
        } catch (error) {
            setError(error.response?.data?.message || "errore creazione post"); // Gestisce eventuali errori
        }
    };

    return (
        <>
            {/* Pulsante per aprire il modal */}
            <div
                onClick={handleShow}
                className="form-control create-post-form text-muted d-flex align-items-center mt-5"
                style={{ cursor: "pointer" }}>
                Add new post
            </div>

            {/* Modal per creare un nuovo post */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Mostra il messaggio di errore se c'è un errore */}
                    {error && <Alert variant="danger">{error}</Alert>}

                    {/* Form per inserire i dettagli del post */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert title"
                                name="title"
                                value={post.title}
                                onChange={(e) => setPost((formData) => ({ ...formData, title: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert category"
                                name="category"
                                value={post.category}
                                onChange={(e) => setPost((formData) => ({ ...formData, category: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="cover">
                            <Form.Label>Cover</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {previewImage &&
                                <img
                                    src={previewImage}
                                    alt="Cover"
                                    className='mt-2'
                                    style={{ width: "200px" }} />}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Insert description"
                                name="description"
                                value={post.description}
                                onChange={(e) => setPost((formData) => ({ ...formData, description: e.target.value }))}
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="readTimeValue">
                                    <Form.Label>Read time value</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Insert read time value"
                                        name="readTimeValue"
                                        value={post.readTime.value}
                                        onChange={(e) => setPost((formData) => ({ ...formData, readTime: { ...formData.readTime, value: e.target.value } }))}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="readTimeUnit">
                                    <Form.Label>Read time unit</Form.Label>
                                    <Form.Select
                                        value={post.readTime.unit}
                                        onChange={(e) => setPost((formData) => ({ ...formData, readTime: { ...formData.readTime, unit: e.target.value } }))}
                                    >
                                        <option value="minuti">minuti</option>
                                        <option value="ore">ore</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Post
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalCreatePost;
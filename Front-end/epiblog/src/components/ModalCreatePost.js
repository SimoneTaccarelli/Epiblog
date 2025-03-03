import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Definizione del componente ModalCreatePost
function ModalCreatePost() {
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

    // Funzione per gestire l'invio del form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene il comportamento predefinito del form
        try {
            // Controlla se l'utente è autenticato
            if (!user || !user._id) {
                throw new Error("User not logged in");
            }
            
            // Crea un oggetto postdata con i dati del post e l'ID dell'autore
            const postdata = {
                ...post,
                author: user._id, // Usa l'ID dell'utente autenticato
                readTime: {
                    ...post.readTime,
                    value: parseInt(post.readTime.value)
                }
            };
            console.log("dati da inviare : ", postdata);
            
            // Invia una richiesta POST al server per creare un nuovo post
            const response = await axios.post("http://localhost:4000/posts", postdata);
            if (response && response.data) {
                console.log("Post created: ", response.data);
                navigate("/"); // Naviga alla pagina principale se l'operazione ha successo
                handleClose(); // Chiude il modal
            }
        } catch (error) {
            setError(error.response?.data?.message || "errore creazione post"); // Gestisce eventuali errori
        }
    };

    return (
        <>
            {/* Pulsante per aprire il modal */}
            <Button variant="primary" onClick={handleShow}>
                Add new post
            </Button>

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
                                onChange={(e) => setPost((prevPost) => ({ ...prevPost, title: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert category"
                                name="category"
                                value={post.category}
                                onChange={(e) => setPost((prevPost) => ({ ...prevPost, category: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="cover">
                            <Form.Label>Cover</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert cover"
                                name="cover"
                                value={post.cover}
                                onChange={(e) => setPost((prevPost) => ({ ...prevPost, cover: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Insert description"
                                name="description"
                                value={post.description}
                                onChange={(e) => setPost((prevPost) => ({ ...prevPost, description: e.target.value }))}
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
                                        onChange={(e) => setPost((prevPost) => ({ ...prevPost, readTime: { ...prevPost.readTime, value: e.target.value } }))}
                                    />
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
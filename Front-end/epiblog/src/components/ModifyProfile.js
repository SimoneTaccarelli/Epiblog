import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Definizione del componente ModifyProfile
function ModifyProfile() {
    // Stato per gestire la visibilità del modal
    const [show, setShow] = useState(false);



    // Stato per gestire i dati dell'utente da modificare
    const [modifyUser, setModifyUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        profilePic: "",
    });

    // Stato per gestire l'immagine di copertina
    const [coverImage, setCoverImage] = useState(null);



    // Stato per gestire l'anteprima dell'immagine di copertina
    const [previewImage, setPreviewImage] = useState('');

    // Hook per ottenere le informazioni sull'utente autenticato
    const { user, setUser } = useAuth();

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

    // Effetto per precompilare i campi del modulo con i dati dell'utente autenticato
    useEffect(() => {
        if (user) {
            setModifyUser({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                oldPassword: "",
                newPassword: "",
                profilePic: user.profilePic,
            });
            setPreviewImage(user.profilePic);
        }
    }, [user]);

    // Funzione per gestire l'invio del form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene il comportamento predefinito del form
        try {
            // Controlla se l'utente è autenticato
            if (!user || !user._id) {
                throw new Error("User not logged in");
            }

            // Crea un oggetto FormData per inviare i dati dell'utente modificato
            const userModify = new FormData();
            userModify.append("firstName", modifyUser.firstName);
            userModify.append("lastName", modifyUser.lastName);
            userModify.append("email", modifyUser.email);
            userModify.append("currentPassword", modifyUser.oldPassword);
            userModify.append("newPassword", modifyUser.newPassword);
            userModify.append("profilePic", coverImage); // Aggiunge l'immagine di copertina al FormData


            console.log("Dati inviati al backend:", Object.fromEntries(userModify.entries()));


            // Invia una richiesta PUT al server per aggiornare l'utente
            const response = await axios.put(`http://localhost:4000/users/${user._id}`, userModify, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response);
            console.log(response.data);
            if (response && response.data) {
                console.log("User updated: ", response.data);

                // Aggiorna il contesto con i nuovi dati dell'utente modificato
                setUser(response.data);



                localStorage.setItem('user', JSON.stringify(response.data)); // Aggiorna il localStorage

                navigate("/"); // Naviga alla pagina principale se l'operazione ha successo
                handleClose(); // Chiude il modal
            }
        } catch (error) {
            setError(error.response?.data?.message || "Error updating profile"); // Gestisce eventuali errori
        }
    };

    return (
        <>
            {/* Pulsante per aprire il modal */}
            <Button variant="primary" onClick={handleShow}>
                Modify Profile
            </Button>

            {/* Modal per modificare il profilo */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Mostra il messaggio di errore se c'è un errore */}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {/* 🔹 Sezione 1: Info utente */}
                        <h5>General Information</h5>
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert first name"
                                value={modifyUser.firstName}
                                onChange={(e) => setModifyUser((prev) => ({ ...prev, firstName: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert last name"
                                value={modifyUser.lastName}
                                onChange={(e) => setModifyUser((prev) => ({ ...prev, lastName: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Insert email"
                                value={modifyUser.email}
                                onChange={(e) => setModifyUser((prev) => ({ ...prev, email: e.target.value }))}
                            />
                        </Form.Group>

                        {/* 🔹 Sezione 2: Modifica immagine */}
                        <h5>Profile Picture</h5>
                        <Form.Group className="mb-3" controlId="profilePic">
                            <Form.Label>Upload new profile picture</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                            {/* Anteprima dell'immagine attuale */}
                            {previewImage && (
                                <img src={previewImage} alt="Profile Preview" className="mt-2" style={{ width: "200px", borderRadius: "10px" }} />
                            )}
                        </Form.Group>

                        {/* 🔹 Sezione 3 (Opzionale): Cambio password */}
                        <h5>Change Password (Optional)</h5>
                        <Form.Group className="mb-3" controlId="oldPassword">
                            <Form.Label>Old password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Insert old password"
                                value={modifyUser.oldPassword}
                                onChange={(e) => setModifyUser((prev) => ({ ...prev, oldPassword: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>New password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Insert new password"
                                value={modifyUser.newPassword}
                                onChange={(e) => setModifyUser((prev) => ({ ...prev, newPassword: e.target.value }))}
                            />
                        </Form.Group>

                        {/* Pulsanti */}
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

export default ModifyProfile;
import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import MyProfile from './MyProfile';

function ModifyUser() {
    const { user, updateUser } = useAuth();
    const [previewImage, setPreviewImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Stato per gestire i dati dell'utente da modificare
    const [modifyUser, setModifyUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        profilePic: "",
    });

    useEffect(() => {
        if (user) {
            setModifyUser({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                profilePic: user.profilePic || "",
            });
            setPreviewImage(user.profilePic || "");
        }
    }, [user]);

    // Funzione per gestire il cambiamento dell'immagine di copertina
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const Modifyinfo = async (e) => {
        e.preventDefault();

        const newInfoUser = new FormData();
        newInfoUser.append('firstName', modifyUser.firstName);
        newInfoUser.append('lastName', modifyUser.lastName);
        newInfoUser.append('email', modifyUser.email);
        if (coverImage) {
            newInfoUser.append('profilePic', coverImage);
        }

        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:4000/auth/${user._id}`, newInfoUser, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            updateUser(response.data); // Aggiorna i dati dell'utente con i nuovi valori

            setLoading(false);
            navigate('/MyProfile');

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

    if (error) {
        return (
            <Container className="text-center">
                <h2>{error}</h2>
            </Container>
        );
    }

    return (
        <Form onSubmit={Modifyinfo}>
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

            {/* Sezione 2: Modifica immagine */}
            <h5>Profile Picture</h5>
            <Form.Group className="mb-3" controlId="profilePic">
                <Form.Label>Upload new profile picture</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                {previewImage && (
                    <img src={previewImage} alt="Profile Preview" className="mt-2" style={{ width: "200px", borderRadius: "10px" }} />
                )}
            </Form.Group>
            <div className="d-flex justify-content-between">
                <Button variant="secondary" as={Link} to="/MyProfile">
                    Close
                </Button>
                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </div>
        </Form>
    );
}

export default ModifyUser;
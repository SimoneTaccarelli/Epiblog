import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/config';

function ModalModifyPost({ id }) {
    const [show, setShow] = useState(false);
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

    const { user } = useAuth();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        fetchPostData(); // Recupera i dati del post quando il modale viene aperto
    };

    const fetchPostData = async () => {
        try {
            const response = await axios.get(`${API_URL}/posts/${id}`);
            if (response && response.data) {
                setPost(response.data);
            }
        } catch (error) {
            console.error("Errore nel recupero dei dati del post:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!user || !user._id) {
                throw new Error("User not logged in");
            }
            const postdata = {
                ...post,
                author: user._id,
                readTime: {
                    ...post.readTime,
                    value: parseInt(post.readTime.value)
                }
            };
            const response = await axios.put(`${API_URL}/posts/${id}`, postdata);
            if (response && response.data) {
                console.log("Post updated: ", response.data);
                navigate("/");
                handleClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || "errore aggiornamento post");
        }
    };

    return (
        <>
            <Button variant='link modifyPostBtn' onClick={handleShow}>
                Modify Post
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
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
                            <Col>
                                <Form.Group className="mb-3" controlId="readTimeUnit">
                                    <Form.Label>Read time unit</Form.Label>
                                    <Form.Select
                                        name="readTimeUnit"
                                        value={post.readTime.unit}
                                        onChange={(e) => setPost((prevPost) => ({ ...prevPost, readTime: { ...prevPost.readTime, unit: e.target.value } }))}
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

export default ModalModifyPost;
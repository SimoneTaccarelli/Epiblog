import { useState } from "react";
import { Form, Button, Card, Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const Register = () => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/users/register", user);
            console.log("User registered: " + user.firstName + " " + user.lastName + " " + user.email + " " + user.password);
            navigate("/");
        } catch (error) {
            setError("Invalid email or password");
        }
    };

    if(Login) {
        <Home id={user.id} />
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} md={6} className="text-center">
                    <h2>Register</h2>
                    <Card>
                        {error && <Card.Text style={{ color: "red" }}>{error}</Card.Text>}
                        <Card.Body>
                            <Card.Text>
                                Please fill in the form to register
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Form onSubmit={handleSubmit} className="formUsers">
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert your first name"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert your last name"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Insert your email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Insert your password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Submit
                        </Button>
                        <p className="mt-3">Already have an account? <a href="/login">Login</a></p>  
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;
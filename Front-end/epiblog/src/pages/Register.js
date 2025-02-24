import { useState } from "react";
import { Form, Button, Card, Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/register", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            });
            navigate("/login");
        } catch (error) {
            setError("Invalid email or password");
        }
    };

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
                            <Form.Control type="text" placeholder="Insert your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type="text" placeholder="Insert your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Insert your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Insert your password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
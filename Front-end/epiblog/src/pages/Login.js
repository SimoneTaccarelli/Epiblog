import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { Form, Button, Card, Row, Col, Container } from "react-bootstrap";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/auth/login/local", {
                email: email,
                password: password,
            });
            const [ user , token ] = response.data;
            login(user , token);
            navigate("/");
        } catch (error) {
            setError("Invalid email or password");
        }
    };

    const handleGoogleLogin = async () => {
        window.location.href = "http://localhost:4000/auth/login/google";
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center text-center">
                <Col xs={12} md={6}>
                    <h2>Login</h2>
                    <Form onSubmit={handleSubmit} className="formUsers">
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Insert your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Insert your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3 align-self-center">
                            Submit
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleGoogleLogin}
                            className="mt-3 align-self-center"
                        >
                            Login with Google
                        </Button>
                        <p className="mt-3">Don't have an account? <a href="/register">Register</a></p>
                        {error && <Card.Text style={{ color: "red" }}>{error}</Card.Text>}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;

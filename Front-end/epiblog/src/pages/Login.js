import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { Form, Button, Card ,Row, Col, Container } from "react-bootstrap";
import axios from "axios";

const Login = () => {
    const[email , setEmail] = useState("");
    const[password , setPassword] = useState("");
    const { login } = useAuth();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/users/login", {
                identifier: email,
                password: password,
            });
            login(response.data);
            navigate("/");
        } catch (error) {
            setError("Invalid email or password");
        }
    };

    return(
        <Container className="mt-5">
            <Row className = "justify-content-center text-center">
                <Col xs={12} md={6}>
                <h2>Login</h2>
                <Form onSubmit={handleSubmit} className = "formUsers"> 
                    <Form.Group classname="mb-3" controllId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="insert your emil" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group classname="mb-3" controllId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="insert your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3 aling-self-center" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <p className="mt-3">Don't have an account? <a href="/register">Register</a></p>
                    {error && <Card.Text style={{ color: "red" }}>{error}</Card.Text>}
                </Form>
                </Col>
            </Row>
        </Container>
    )

}

export default Login;

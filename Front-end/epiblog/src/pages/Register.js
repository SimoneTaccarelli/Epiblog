import { useState } from "react";
import { Form, Button, Card, Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const [profileimg, setProfileimg] = useState("");
    const [previwprofileimg, setPreviwprofileimg] = useState("");

    const previw = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileimg(file);
            setPreviwprofileimg(URL.createObjectURL(file));
        }
    };
  

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = new FormData();
        newUser.append("firstName", user.firstName);
        newUser.append("lastName", user.lastName);
        newUser.append("email", user.email);
        newUser.append("password", user.password);
        newUser.append("profilePic", profileimg);
        

        try {
            const response = await axios.post("http://localhost:4000/auth/register", newUser);
            console.log("User registered: " + response.data.user.firstName);  // ✅ CORRETTO
            const [user , token ] = response.data
            login(user , token ); // Usa i dati della risposta per il login
            navigate("/");
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
                            <Form.Control
                                type="text"
                                placeholder="Insert your first name"
                                name="firstName"
                                value={user.firstName}
                                onChange={(e) => setUser((prevUser) => ({ ...prevUser, firstName: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Insert your last name"
                                name="lastName"
                                value={user.lastName}
                                onChange={(e) => setUser((prevUser) =>({ ...prevUser, lastName: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Insert your email"
                                name="email"
                                value={user.email}
                                onChange={(e) => setUser((prevUser) => ({ ...prevUser, email: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Insert your password"
                                name="password"
                                value={user.password}
                                onChange={(e) => setUser((prevUser) => ({ ...prevUser, password: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="profilePic">
                            <Form.Label>Profile picture</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                name="profilePic"
                                onChange={previw}
                            />
                            {previwprofileimg &&
                            <img 
                            src={previwprofileimg}
                            alt="Profile"  
                            className='mt-2'
                            style={{ width: "200px" }} />}
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
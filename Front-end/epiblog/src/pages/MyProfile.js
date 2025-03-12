import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Card, Row, Container, Spinner, Alert } from "react-bootstrap";
import ModifyImage from "../components/ModifyImageERR";
import '../Style/PP.css'; // Importa il file CSS

function MyProfile() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const defaultImg = `https://ui-avatars.com/api/?background=8c00ff&color=fff&name=${user?.firstName}+${user?.lastName}`;

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/posts?author=${user._id}`);
            if (Array.isArray(response.data)) {
                setPosts(response.data);
            } else {
                setPosts([]);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError("Error loading data");
            setLoading(false);
        }
    };

        if (user) {
            fetchPosts();
        }
        console.log('my profile', user);
    }, [user]);

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
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <div className="text-center">
                <div className="ProfilePic">
                    <img
                        className="ProfilePic"
                        src={user?.profilePic || defaultImg}
                        alt="profile"
                        style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div className="modPicUs">
                        <ModifyImage />
                    </div>
                </div>
                <h2>{user?.firstName} {user?.lastName}</h2>
            </div>
            {Array.isArray(posts) && posts.map((post) => (
                user._id === post.author._id && (
                    <Card key={post._id} className="my-4">
                        <Row className="align-items-center">
                            <div className="col-auto">
                                <Card.Img
                                className="ms-3 my-3"
                                    variant="top"
                                    src={user.profilePic || defaultImg}
                                    alt="profile"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%',  objectFit: 'cover' }}
                                />
                            </div>
                            <div className="col">
                                <h5>{user.firstName} {user.lastName}</h5>
                            </div>
                        </Row>
                        <Card.Img variant="top" src={post.cover} />
                        <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Text>{post.category}</Card.Text>
                            <Card.Text>{post.description}</Card.Text>
                            <Card.Text>{post.readTime.value} {post.readTime.unit}</Card.Text>
                        </Card.Body>
                    </Card>
                )
            ))}
        </Container>
    );
}

export default MyProfile;
import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Card, Row, Container, Spinner, Alert, Pagination, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import '../Style/PP.css'; // Importa il file CSS

function MyProfile() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    
    const defaultImg = `https://ui-avatars.com/api/?background=8c00ff&color=fff&name=${user?.firstName}+${user?.lastName}`;

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/posts?author=${user._id}&page=${currentPage}&limit=5`);
                setTotalPages(response.data.total);
                setPosts(response.data.posts);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError("Error loading data");
                setLoading(false);
            }
        };      if (user) {
            fetchPosts();
        }
    }, [user,currentPage]);

    

    useEffect(() => {
        console.log("User:", user);
        console.log("Posts:", posts);
    }, [user, posts]);

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
                    <Link to='/ModifyUser' variant="primary" className="modPicUs">
                        <i className="bi bi-pencil-square"></i>
                    </Link>
                </div>
                <h2>{user?.firstName} {user?.lastName}</h2>
            </div>
            <Col md={7} className='mt-4 allCard '>
            {Array.isArray(posts) && posts.map((post) => (
                user._id === post.author?._id && (
                    <Card key={post._id} className="my-4 post-card">
                        <Row className="align-items-center">
                            <div className="col-auto">
                                <Card.Img
                                    className="ms-3 my-3"
                                    variant="top"
                                    src={user.profilePic || defaultImg}
                                    alt="profile"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="col">
                                <h5>{user.firstName} {user.lastName}</h5>
                            </div>
                        </Row>
                        <div
                            className='post-cover'
                            style={{
                                backgroundImage: `url(${post.cover})`
                            }}
                        >
                        </div>
                        <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Text>{post.category}</Card.Text>
                            <Card.Text>{post.description}</Card.Text>
                            <Card.Text>{post.readTime.value} {post.readTime.unit}</Card.Text>
                        </Card.Body>
                    </Card>
                )
            ))}
            </Col>
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination className='d-flex justify-content-center mt-4'>
                        <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.min(prev - 1, 1))}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        />
                    </Pagination>
                </div>
            )
            }
        </Container>
    );
}

export default MyProfile;
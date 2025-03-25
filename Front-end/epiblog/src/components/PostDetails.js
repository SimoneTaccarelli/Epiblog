import axios from 'axios';
import { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config/config';
import AddComments from './AddComments';

const PostDetails = () => {
    const [post, setPost] = useState({});
    const { postId } = useParams();
    console.log('id del post:', postId);
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${API_URL}/posts/details/${postId}`);
                console.log(response.data);
                setPost(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPost();
    }, [postId]);

    // Controlla se il post esiste prima di renderizzare i suoi dettagli
    if (!post._id) {
        return <Container className="mt-5"><p>Caricamento post in corso...</p></Container>
    }

    return (
        <Container className="my-5">
            <Card className="border-0 post-card">
                <Card.Header className="">
                    <div className="d-flex align-items-center">
                        <Card.Img
                            src={post.author?.profilePic}
                            alt={`${post.author?.firstName} ${post.author?.lastName}`}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                            className="me-3"
                        />
                        <div>
                            <h5 className="mt-4">{post.author?.firstName} {post.author?.lastName}</h5>
                            <small >
                                Pubblicato il {new Date(post.createdAt).toLocaleDateString('it-IT')}
                            </small>
                        </div>
                    </div>
                </Card.Header>
                
                <Card.Body className="p-0">
                    <Row className="g-0">
                        {/* Colonna di sinistra con l'immagine */}
                        <Col md={5} className="position-relative">
                            <div 
                                style={{
                                    backgroundImage: `url(${post.cover})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '400px',
                                    width: '100%'
                                }}
                            />
                        </Col>
                        
                        {/* Colonna di destra con i dettagli del post */}
                        <Col md={7} className="p-4">
                            <Badge bg="secondary" className="mb-2">{post.category}</Badge>
                            <h1 className="mb-4">{post.title}</h1>
                            <p className="text-muted mb-4">
                                Tempo di lettura: {post.readTime?.value} {post.readTime?.unit}
                            </p>
                            <p className="lead mb-4">{post.description}</p>
                            
                        </Col>
                    </Row>
                </Card.Body>
                <AddComments postId={post._id} />
            </Card>
        </Container>
    );
}

export default PostDetails;

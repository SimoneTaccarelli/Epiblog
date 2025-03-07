import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import ModalCreatePost from '../components/ModalCreatePost';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]); // Inizializza come array vuoto
    const { user } = useAuth();

    useEffect(() => {
        axios.get('http://localhost:4000/posts')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                } else {
                    console.error('La risposta del server non è un array:', response.data);
                }
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <Container>
            {user && <ModalCreatePost />}
            <Row>
                {Array.isArray(posts) && posts.map(post => (
                    <Col key={post._id} md={4}>
                        <PostCard post={post} /> {/* Passa il singolo post */}
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Home;
import {useState, useEffect} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import ModalCreatePost from '../components/ModalCreatePost';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const { user } = useAuth();
    

    useEffect(() => {
        axios.get('http://localhost:4000/posts')
            .then(response => setPosts(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <Container>
            {user && <ModalCreatePost/>}
            <Row>
                {posts.map(post => (
                    <Col key={post.id} md={4}>
                        <PostCard post={posts} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Home;
import { useState, useEffect } from 'react';
import { Container, Col } from 'react-bootstrap';
import axios from 'axios';
import ModalCreatePost from '../components/ModalCreatePost';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const { user } = useAuth();
    const [refreshCounter, setRefreshCounter] = useState(0);

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
    }, [refreshCounter]);

    const refreshPosts = () => {
        console.log("refreshPosts chiamata, incremento contatore");
        setRefreshCounter(prev => {
            console.log("Contatore incrementato da", prev, "a", prev + 1);
            return prev + 1;
        });
    };

    return (
        <Container>
            {user && <ModalCreatePost updatePost={refreshPosts} />}
            <div className='d-flex flex-column align-items-center'>
                {Array.isArray(posts) && posts.map(post => (
                    <Col key={post._id} md={9} >
                        <PostCard post={post} refreshPosts={refreshPosts} /> 
                    </Col>
                ))}
            </div>
        </Container>
    );
}

export default Home;
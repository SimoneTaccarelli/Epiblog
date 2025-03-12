import { useState, useEffect } from 'react';
import { Container, Col } from 'react-bootstrap';
import axios from 'axios';
import ModalCreatePost from '../components/ModalCreatePost';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]); // Inizializza come array vuoto
    const { user } = useAuth();
    const [newPost,setNewPost] = useState(false);

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

            if(newPost){
                setNewPost(false);
            }
    }, [newPost]);

    const updatePost = () => {
        setNewPost(true);
    };

    return (
        <Container>
            {user && <ModalCreatePost updatePost={updatePost} />}
            <div className='d-flex flex-column align-items-center'>
                {Array.isArray(posts) && posts.map(post => (
                    <Col key={post._id} md={9} >
                        <PostCard post={post} /> {/* Passa il singolo post */}
                    </Col>
                ))}
            </div>
        </Container>
    );
}

export default Home;
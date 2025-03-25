import { useState, useEffect } from 'react';
import { Container, Col, Pagination, Row } from 'react-bootstrap';
import axios from 'axios';
import ModalCreatePost from '../components/ModalCreatePost';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import SuggestedUsers from '../components/SuggestedUsers';
import { API_URL } from '../config/config';  

const Home = () => {
    const [posts, setPosts] = useState([]);
    const { user } = useAuth();
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        axios.get(`${API_URL}/posts?page=${currentPage}&limit=5`)
            .then(response => {
                setTotalPages(response.data.total);
                setPosts(response.data.posts);
            }

            )
            .catch(error => console.error(error));
    }, [refreshCounter, currentPage]);

    const refreshPosts = () => {
        setRefreshCounter(prev => {
            return prev + 1;
        });
    };

    return (
        <Container>
            {user && <ModalCreatePost updatePost={refreshPosts} />}
            
            {/* Rimuovi flex-column dalla Row per avere colonne affiancate */}
            <Row>
                {/* Prima colonna per i post (con scroll verticale) */}
                <Col md={9} className='mt-4'>
                    <div className="d-flex flex-column align-items-center">
                        {/* I post sono impilati verticalmente all'interno della colonna */}
                        {Array.isArray(posts) && posts.map(post => (
                            <PostCard 
                                key={post._id}
                                post={post} 
                                refreshPosts={refreshPosts}
                                className="mb-3 w-100"
                            />
                        ))}
                    </div>
                </Col>
                
                {/* Seconda colonna per gli utenti suggeriti */}
                {user && (
                <Col md={3} className='mt-4'>
                    <SuggestedUsers id={user._id}/>
                </Col>
                )}
            </Row>
            
            {/* Paginazione */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
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
            )}
        </Container>
    );  
}

export default Home;
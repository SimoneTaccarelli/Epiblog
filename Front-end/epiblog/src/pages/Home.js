import { useState, useEffect } from 'react';
import { Container, Col, Pagination } from 'react-bootstrap';
import axios from 'axios';
import ModalCreatePost from '../components/ModalCreatePost';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const { user } = useAuth();
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        axios.get(`http://localhost:4000/posts?page=${currentPage}&limit=5`)
            .then(response => {
                setTotalPages(response.data.total);
                setPosts(response.data.posts);
            }

            )
            .catch(error => console.error(error));
    }, [refreshCounter, currentPage]);

    const refreshPosts = () => {
        console.log("refreshPosts chiamata, incremento contatore");
        setRefreshCounter(prev => {
            console.log("Contatore incrementato da", prev, "a", prev + 1);
            return prev + 1;
        });
    };

    return (
        <Container>
            <div className='d-flex flex-column align-items-center'>
                <Col md={7} className='mt-4 allCard '>
                    {user && <ModalCreatePost updatePost={refreshPosts} />}
                    {Array.isArray(posts) && posts.map(post => (
                        <PostCard 
                        key={post._id}
                        post={post} 
                        refreshPosts={refreshPosts} />
                    ))}
                </Col>
            </div>
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
            )}
        </Container>
    );  
}

export default Home;
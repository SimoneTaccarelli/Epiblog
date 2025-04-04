import React, { useState } from 'react';
import { Button, Card, Row, Modal } from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config/config';
import ModalModifyPost from './ModalModifyPost';
import AddComments from './AddComments';

const PostCard = ({ post, refreshPosts }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Verifica che post esista per evitare errori
    if (!post) return null;

    const defaultImg = `https://ui-avatars.com/api/?background=8c00ff&color=fff&name=${post.author?.firstName || 'User'}+${post.author?.lastName || ''}`;

    const confirmDelete = (e) => {
        if (e) e.stopPropagation();
        setShowConfirmModal(true);
    };

    const deletePost = async () => {
        // Verifica che post._id esista
        if (!post || !post._id) {
            console.error("Post ID not found");
            alert("Impossibile eliminare il post: ID non trovato");
            return;
        }
        
        try {
            setIsDeleting(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/posts/${post._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('Post deleted successfully');
                setShowConfirmModal(false);
                refreshPosts();
            } else {
                const errorData = await response.json();
                console.error('Failed to delete post:', errorData);
                alert('Errore durante l\'eliminazione del post: ' + (errorData.message || 'Errore sconosciuto'));
            }
        } catch (error) {
            console.error('Error during delete request:', error);
            alert('Si è verificato un errore durante l\'eliminazione del post');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClickDetails = () => {
        navigate(`/post/${post._id}`);
    }

    // Verifica se l'utente è l'autore del post in modo sicuro
    const isAuthor = user && post.author && user._id === post.author._id;

    return (
        <>
            <Card key={post._id} className="my-4 w-75 post-card" >
                <div onClick={handleClickDetails}>
                    <Card.Header className="d-flex justify-content-between p-0">
                        <Row className="align-items-center">
                            <div className="col-auto">
                                <Card.Img
                                    className="ms-3 my-3"
                                    variant="top"
                                    src={post.author?.profilePic || defaultImg}
                                    alt="profile"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="col">
                                <h5>{post.author?.firstName || 'Utente'} {post.author?.lastName || ''}</h5>
                            </div>
                        </Row>
                    </Card.Header>

                    <Link to={`/post/${post._id}`} className='link-postDetails my-3 mx-3'>{post.title || 'Senza titolo'}</Link>
                    <div
                        className='post-cover'
                        style={{
                            backgroundImage: post.cover ? `url(${post.cover})` : 'none'
                        }}
                    >
                    </div>
                </div>
                <Card.Body>
                    {isAuthor ? (
                        <div className="d-flex justify-content-between">
                            <div>
                                <span className="badge bg-secondary me-2">{post.category || 'Nessuna categoria'}</span>
                            </div>
                            <div>
                                <Button 
                                    variant='link' 
                                    className="deletePostBtn" 
                                    onClick={confirmDelete}
                                >
                                    Delete Post
                                </Button>
                                <ModalModifyPost id={post._id} />
                            </div>
                        </div>
                    ) : (
                        <Card.Subtitle className="mb-2 text-muted">{post.category || 'Nessuna categoria'}</Card.Subtitle>
                    )}

                    <Card.Text>{post.description || 'Nessuna descrizione'}</Card.Text>
                    <small className="text-muted">Read time: {post.readTime?.value || '0'} {post.readTime?.unit || 'min'}</small>
                </Card.Body>
                
                <AddComments postId={post._id} />
            </Card>

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Conferma eliminazione</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sei sicuro di voler eliminare questo post? Questa azione non può essere annullata.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Annulla
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={deletePost}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Eliminazione...' : 'Elimina'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PostCard;
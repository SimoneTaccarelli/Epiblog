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
            
            // Log per debug
            console.log("Tentativo di eliminare post:", post._id);o di eliminare post:", post._id);o di eliminare post:", post._id);
            console.log("Token utilizzato:", token ? "Token presente" : "Token mancante");oken utilizzato:", token ? "Token presente" : "Token mancante");oken utilizzato:", token ? "Token presente" : "Token mancante");
            
            const response = await fetch(`${API_URL}/posts/${post._id}`, {osts/${post._id}`, {osts/${post._id}`, {
                method: 'DELETE',ethod: 'DELETE',ethod: 'DELETE',
                headers: { headers: { headers: {
                    'Authorization': `Bearer ${token}`,        'Authorization': `Bearer ${token}`,        'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'ype': 'application/json'ype': 'application/json'
                }
            });
            
            const data = await response.json();ta = await response.json();ta = await response.json();
            console.log("Risposta dal server:", data);
            
            if (response.ok) {
                console.log('Post deleted successfully');   console.log('Post deleted successfully');   console.log('Post deleted successfully');
                setShowConfirmModal(false);nfirmModal(false);nfirmModal(false);
                refreshPosts();
            } else {
                console.error('Failed to delete post:', data);sole.error('Failed to delete post:', data);sole.error('Failed to delete post:', data);
                alert('Errore durante l\'eliminazione del post: ' + (data.message || 'Errore sconosciuto'));ante l\'eliminazione del post: ' + (data.message || 'Errore sconosciuto'));ante l\'eliminazione del post: ' + (data.message || 'Errore sconosciuto'));
            }   }   }
        } catch (error) {  } catch (error) {  } catch (error) {
            console.error('Error during delete request:', error);            console.error('Error during delete request:', error);            console.error('Error during delete request:', error);
            alert('Si è verificato un errore durante l\'eliminazione del post');errore durante l\'eliminazione del post');errore durante l\'eliminazione del post');
        } finally {
            setIsDeleting(false);       setIsDeleting(false);       setIsDeleting(false);
        }        }        }
    };

    const handleClickDetails = () => {    const handleClickDetails = () => {    const handleClickDetails = () => {
        navigate(`/post/${post._id}`);gate(`/post/${post._id}`);gate(`/post/${post._id}`);
    }

    // Verifica se l'utente è l'autore del post in modo sicuro modo sicuro modo sicuro
    const isAuthor = user && post.author && user._id === post.author._id;

    return (
        <>
            <Card key={post._id} className="my-4 w-75 post-card" >t-card" >t-card" >
                <div onClick={handleClickDetails}>>>
                    <Card.Header className="d-flex justify-content-between p-0">>>
                        <Row className="align-items-center">ms-center">ms-center">
                            <div className="col-auto">
                                <Card.Imgard.Imgard.Img
                                    className="ms-3 my-3"  className="ms-3 my-3"  className="ms-3 my-3"
                                    variant="top"
                                    src={post.author?.profilePic || defaultImg}
                                    alt="profile"  alt="profile"  alt="profile"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            </div>                            </div>                            </div>
                            <div className="col">
                                <h5>{post.author?.firstName || 'Utente'} {post.author?.lastName || ''}</h5>        <h5>{post.author?.firstName || 'Utente'} {post.author?.lastName || ''}</h5>        <h5>{post.author?.firstName || 'Utente'} {post.author?.lastName || ''}</h5>
                            </div>
                        </Row>
                    </Card.Header>

                    <Link to={`/post/${post._id}`} className='link-postDetails my-3 mx-3'>{post.title || 'Senza titolo'}</Link>Link to={`/post/${post._id}`} className='link-postDetails my-3 mx-3'>{post.title || 'Senza titolo'}</Link>Link to={`/post/${post._id}`} className='link-postDetails my-3 mx-3'>{post.title || 'Senza titolo'}</Link>
                    <div
                        className='post-cover'  className='post-cover'  className='post-cover'
                        style={{le={{le={{
                            backgroundImage: post.cover ? `url(${post.cover})` : 'none'roundImage: post.cover ? `url(${post.cover})` : 'none'roundImage: post.cover ? `url(${post.cover})` : 'none'
                        }}
                    >
                    </div>
                </div>
                <Card.Body>
                    {isAuthor ? (
                        <div className="d-flex justify-content-between">ify-content-between">ify-content-between">
                            <div>
                                <span className="badge bg-secondary me-2">{post.category || 'Nessuna categoria'}</span>econdary me-2">{post.category || 'Nessuna categoria'}</span>econdary me-2">{post.category || 'Nessuna categoria'}</span>
                            </div>>>
                            <div>
                                {/* Modifica del pulsante elimina per renderlo simile a Modifica */}ica del pulsante elimina per renderlo simile a Modifica */}ica del pulsante elimina per renderlo simile a Modifica */}
                                <Button 
                                    variant="outline-danger"  variant="outline-danger"  variant="outline-danger"
                                    size="sm"      size="sm"      size="sm"
                                    onClick={confirmDelete}           onClick={confirmDelete}           onClick={confirmDelete}
                                    className="me-2"
                                    style={{              style={{              style={{
                                        borderRadius: '4px',                                        borderRadius: '4px',                                        borderRadius: '4px',
                                        padding: '0.375rem 0.75rem',
                                        fontSize: '0.875rem' 
                                    }}        }}        }}
                                >                >                >
                                    Elimina Post
                                </Button>             </Button>             </Button>
                                <ModalModifyPost id={post._id} />                                <ModalModifyPost id={post._id} />                                <ModalModifyPost id={post._id} />
                            </div>
                        </div>
                    ) : (
                        <Card.Subtitle className="mb-2 text-muted">{post.category || 'Nessuna categoria'}</Card.Subtitle>ubtitle className="mb-2 text-muted">{post.category || 'Nessuna categoria'}</Card.Subtitle>ubtitle className="mb-2 text-muted">{post.category || 'Nessuna categoria'}</Card.Subtitle>
                    )}

                    <Card.Text>{post.description || 'Nessuna descrizione'}</Card.Text>
                    <small className="text-muted">Read time: {post.readTime?.value || '0'} {post.readTime?.unit || 'min'}</small>sName="text-muted">Read time: {post.readTime?.value || '0'} {post.readTime?.unit || 'min'}</small>sName="text-muted">Read time: {post.readTime?.value || '0'} {post.readTime?.unit || 'min'}</small>
                </Card.Body>
                
                <AddComments postId={post._id} />._id} />._id} />
            </Card>

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>ow={showConfirmModal} onHide={() => setShowConfirmModal(false)}>ow={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Conferma eliminazione</Modal.Title>tle>Conferma eliminazione</Modal.Title>tle>Conferma eliminazione</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sei sicuro di voler eliminare questo post? Questa azione non può essere annullata.</Modal.Body>al.Body>Sei sicuro di voler eliminare questo post? Questa azione non può essere annullata.</Modal.Body>al.Body>Sei sicuro di voler eliminare questo post? Questa azione non può essere annullata.</Modal.Body>
                <Modal.Footer>     <Modal.Footer>     <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>              <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>              <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Annulla                       Annulla                       Annulla
                    </Button>                    </Button>                    </Button>
                    <Button ton ton 













export default PostCard;}    );        </>            </Modal>                </Modal.Footer>                    </Button>                        {isDeleting ? 'Eliminazione...' : 'Elimina'}                    >                        disabled={isDeleting}                        onClick={deletePost}                        variant="danger" 












export default PostCard;}    );        </>            </Modal>                </Modal.Footer>                    </Button>                        {isDeleting ? 'Eliminazione...' : 'Elimina'}                    >                        disabled={isDeleting}                        onClick={deletePost}                        variant="danger"                         variant="danger" 
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
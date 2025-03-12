import React from 'react';
import { Button, Card, Row } from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext';
import ModalModifyPost from './ModalModifyPost';
import AddComments from './AddComments';

const PostCard = ({ post , refreshPosts }) => {
    const { user } = useAuth();

    const defaultImg = `https://ui-avatars.com/api/?background=8c00ff&color=fff&name=${post.author?.firstName}+${post.author?.lastName}`;

    const deletePost = async () => {
        try {
            const response = await fetch(`http://localhost:4000/posts/${post._id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                refreshPosts()
            } else {
                console.error('Failed to delete post');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
        <Card key={post._id} className="my-4 w-75">
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
                        <h5>{post.author?.firstName} {post.author?.lastName}</h5>
                    </div>
                </Row>
            </Card.Header>

            <Card.Title className='my-3 mx-3'>{post.title}</Card.Title>
            <div
                className='post-cover'
                style={{
                    backgroundImage: `url(${post.cover})`
                }}
            >
            </div>
            <Card.Body>
                {user && user._id === post.author._id ? (
                    <div className="d-flex justify-content-between">
                        <div>
                            <span className="badge bg-secondary me-2">{post.category}</span>
                        </div>
                        <div>
                            <Button variant='link deletPostBtn' onClick={deletePost}>Delete Post</Button>
                            <ModalModifyPost id={post._id} />
                        </div>
                    </div>
                ) : (
                    <Card.Subtitle className="mb-2 text-muted">{post.category}</Card.Subtitle>
                )}

                <Card.Text>{post.description}</Card.Text>
                <small className="text-muted">Read time: {post.readTime.value} {post.readTime.unit}</small>
            </Card.Body>
            <AddComments postId={post._id}/>
        </Card>
       
        </>
    );
}

export default PostCard;
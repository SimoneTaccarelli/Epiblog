import React from 'react';
import { Button, Card } from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext';
import ModalModifyPost from './ModalModifyPost';

const PostCard = ({ post }) => {
    const { user } = useAuth();

    const deletPost = async () => {
        try {
            const response = await fetch(`http://localhost:4000/posts/${post._id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Post deleted');
            } else {
                console.error('Failed to delete post');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card>
            <Card.Title>{post.title}</Card.Title>
            <Card.Img variant="top" src={post.cover} />
            <Card.Body>
                <Card.Subtitle className="mb-2 text-muted">{post.category}</Card.Subtitle>
                <Card.Text>{post.description}</Card.Text>
                <Card.Footer>
                    {user ? (
                        <>
                            <Button variant="primary" onClick={deletPost}>Delete</Button>
                            <ModalModifyPost id={post._id} />
                            <small className="text-muted">Read time: {post.readTime.value} {post.readTime.unit}</small>
                        </>
                    ) : (
                        <small className="text-muted">Read time: {post.readTime.value} {post.readTime.unit}</small>
                    )}
                </Card.Footer>
            </Card.Body>
        </Card>
    );
}

export default PostCard;
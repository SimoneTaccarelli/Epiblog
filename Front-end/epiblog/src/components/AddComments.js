import axios from "axios";
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Comments from "./Comments";
import { API_URL } from "../config/config";

const AddComments = ({ postId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [eliminateComment , setEliminateComment] = useState(false);
    

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${API_URL}/comments/post/${postId}`);
            if (Array.isArray(response.data)) {
                setComments(response.data);
            } else {
                console.error('La risposta del server non è un array:', response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchComments();
        if(eliminateComment){
            setEliminateComment(false);
        }
    }, [postId, eliminateComment]);   

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Devi essere loggato per aggiungere un commento.");
            return;
        }
        const newComment = {
            comment: commentText,
            author: user._id,
            post: postId,
        };
        console.log(newComment);
        try {
            const response = await axios.post(`${API_URL}/comments`, newComment);
            setComments([response.data, ...comments]);
            setCommentText('');
        } catch (error) {
            console.error(error);
        }
    };

    

    const reciveDeleteId = () => {
        setEliminateComment(true);
    }

    return (
        <div>
            {user ? (
                <>
                <Comments comments={comments} reciveDeleteId={reciveDeleteId}  />
                    <Form onSubmit={handleSubmit} className="comment-form">
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Add a comment"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="success BtnAddComm " type="submit">Submit</Button>
                    </Form>
                    
                </>
            ) : (
                <div>
                    <Comments comments={comments.filter(comment => comment.post === postId)} reciveDeleteId={reciveDeleteId} />
                </div>
            )}
        </div>
    );
};

export default AddComments;
import { useAuth } from "../contexts/AuthContext";
import { Row, Button, Card } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../config/config";

const Comments = ({ comments, reciveDeleteId }) => {
    const { user } = useAuth();

 const defaultImg = `https://ui-avatars.com/api/?background=8c00ff&color=fff&name=${user?.firstName}+${user?.lastName}`;
    const deleteComment = async (commentId) => {
        try {
            if (user && user._id=== comments.find(comment => comment._id === commentId).author._id) {
                reciveDeleteId(true);
                
                // Poi elimina il commento
                await axios.delete(`${API_URL}/comments/${commentId}`, {
                    data: { author: user._id }
                });
                
                console.log("Commento eliminato:", commentId);
            } else {
                console.error('Non hai i permessi per eliminare questo commento.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            {comments.map((comment) => (
                <Card.Body key={comment._id} className="comment-section">
                    <Row>
                        <div className="d-flex justify-content-between my-1 mx-2">
                            <div>
                                <img
                                    src={comment.author?.profilePic ||  defaultImg}
                                    alt="profile"
                                    style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <span className="ms-2">{comment.author?.firstName} {comment.author?.lastName}</span>
                            </div>
                            <div>
                                {user && user._id === comment.author?._id && (
                                    <Button 
                                        variant='link deletCommBtn'
                                        onClick={() => deleteComment(comment._id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="mx-5">
                            <span>{comment.comment}</span>
                        </div>
                    </Row>
                </Card.Body>
            ))}
        </div>
    );
}

export default Comments;
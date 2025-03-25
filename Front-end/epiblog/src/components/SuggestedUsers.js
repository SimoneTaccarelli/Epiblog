import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { API_URL } from '../config/config';

const SuggestedUsers = ({id}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
   


    useEffect(() => {
        
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/auth/suggested/${id}`);  
                console.log(response.data);
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, [id]);

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <>
            <Card className="mt-4 post-card">
                <Card.Header >
                    <h5 className="mb-0">Utenti Suggeriti</h5>
                </Card.Header>
                {Array.isArray(users) && users.map(user => {
                    // Genera URL immagine per ogni utente individualmente
                    const userImg = `https://ui-avatars.com/api/?background=8c00ff&color=fff&name=${user.firstName}+${user.lastName}`;
                    
                    return (
                        <Card.Body key={user._id}>
                            <div className="d-flex flex-column align-items-start">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={user.profilePic || userImg}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <span className="ms-3">{user.firstName} {user.lastName}</span>
                                </div>
                                <button  className="AddFriendBtn mt-2 ">Add friend</button>
                            </div>
                        </Card.Body>
                    );
                })}
            </Card>
        </>
    );
}

export default SuggestedUsers;
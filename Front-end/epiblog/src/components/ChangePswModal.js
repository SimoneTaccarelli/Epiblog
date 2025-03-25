import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.js';
import Form from 'react-bootstrap/Form';
import { API_URL } from '../config/config';

function ChangePswModal() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { user } = useAuth();
    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {   
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleChangePsw = (e) => {
        e.preventDefault();

        

         if (password.newPassword !== password.confirmPassword) {
            setError('New password and confirmation do not match');
            return;
        }
        
        if (password.oldPassword === password.newPassword) {
            setError('New password must be different from old password');
            return;
        }
        
        const passwordData= {
            oldPassword: password.oldPassword,
            newPassword: password.newPassword,
            confirmPassword: password.confirmPassword,
        };
         
        
       
        axios
            .put(`${API_URL}/auth/${user._id}/password`, passwordData
            )
            .then((res) => {
                alert('Password changed successfully');
                handleClose();
            })
            .catch((err) => {
                ErrorAlert();
            });
    }

    const ErrorAlert = () => {
        if (error) {
            return <div className="alert alert-danger">{error}</div>;
        }
        return <></>;
    };

    

    return (
        <>
            <Button
                variant="Link"
                onClick={handleShow}
                className="settingsButton">
                <i class="bi bi-person-circle"></i> Change Password
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}

            >
                <Modal.Header closeButton>
                    <Modal.Title>Change password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={handleChangePsw}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Old Password"
                                name="oldPassword"
                                value={password.oldPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="New Password"
                                name="newPassword"
                                value={password.newPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={password.confirmPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" type='submit'>Understood</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ChangePswModal;
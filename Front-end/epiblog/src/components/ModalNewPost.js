import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function ModalNewPost({ id }) {
  const [show, setShow] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    category: "",
    cover: "",
    description: "",
    readTime: ""
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSaveChanges = async () => {
    try {
      await axios.post(`http://localhost:4000/posts/${id}`, {
        title: newPost.title,
        category: newPost.category,
        cover: newPost.cover,
        description: newPost.description,
        readTime: newPost.readTime
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add new post
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input 
            type="text" 
            placeholder="Title" 
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <input
            type="text" 
            placeholder="Category"
            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
          />
          <input
            type="text" 
            placeholder="Cover"
            onChange={(e) => setNewPost({ ...newPost, cover: e.target.value })}
          />
          <input
            type="text" 
            placeholder="Description"
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
          />
          <input
            type="text" 
            placeholder="Read Time"
            onChange={(e) => setNewPost({ ...newPost, readTime: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalNewPost;
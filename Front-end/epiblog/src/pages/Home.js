import { Col, Container, Row } from "react-bootstrap";
import SideBar from "../components/SideBar";
import ModalNewPost from "../components/ModalNewPost";
import {useState , useEffect} from "react";
import axios from "axios";



function Home({id}) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <h1>Home</h1>
      <Container>
        <ModalNewPost id={id} />
        <Row>
          <h2>Posts</h2>
          <Col xs={8}>
            {posts.map((post) => (
              <div key={post._id}>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
      <Container>
       <SideBar/> 
      </Container>
    </>
  );
}

export default Home;
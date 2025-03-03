import { Card, Button, Badge } from "react-bootstrap";

const PostCard = ({ post }) => {
  return (
    <Card>
      <Card.Img variant="top" src={post.cover} />
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.description}</Card.Text>
        <Card.Text>
          <Badge variant="info">{post.category}</Badge>
          <Badge variant="secondary">{post.readTime} min read</Badge>
        </Card.Text>
        <Button variant="primary">Read more</Button>
      </Card.Body>
    </Card>
  );
}

export default PostCard;
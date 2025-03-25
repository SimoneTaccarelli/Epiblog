import './App.css';
import MyNavbar from './components/MyNavbar.js';
import { AuthProvider } from './contexts/AuthContext.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import { Container } from 'react-bootstrap';
import Home from './pages/Home.js';
import MyProfile from './pages/MyProfile.js';
import ModifyUser from './pages/ModifyUser.js';
import Settings from './pages/Settings.js';
import PostDetails from './components/PostDetails.js';




function App() {
  return (
    <Router>
      <AuthProvider>
        <MyNavbar />
        <Container>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path='/MyProfile'element={<MyProfile />} />
            <Route path='/ModifyUser'element={<ModifyUser />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/post/:postId" element={<PostDetails />} />
          </Routes>
        </Container>
        </AuthProvider>
      </Router>
    
  );
}

export default App;

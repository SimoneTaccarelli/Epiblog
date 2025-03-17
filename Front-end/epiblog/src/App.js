import './App.css';
import MyNavbar from './components/MyNavbar.js';
import { AuthProvider } from './contexts/AuthContext.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import { Container,Row } from 'react-bootstrap';
import Home from './pages/Home.js';
import MyProfile from './pages/MyProfile.js';
import ModifyUser from './pages/ModifyUser.js';




function App() {
  return (
    <AuthProvider>
      <Router>
        <MyNavbar />
        <Container>
          <Row>
            <h1 className="text-center mt-3">EpiBlog</h1>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home/>} />
            <Route path='/MyProfile'element={<MyProfile/>}/>
            <Route path='/ModifyUser'element={<ModifyUser/>}/>
          </Routes>
          {/* verrà inserita sidebar con utenti suggeriti */}
          </Row>
        </Container>

      </Router>
    </AuthProvider>
  );
}

export default App;

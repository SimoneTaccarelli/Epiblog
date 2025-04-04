import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import MyProfile from "../pages/MyProfile";
import ModifyUser from "../pages/ModifyUser";
import Settings from "../pages/Settings";
import PostDetails from "../components/PostDetails";
import MyNavbar from "./MyNavbar";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function AppContent() {
    const { user } = useAuth();

    return (
        <>
            <MyNavbar />
            <Container>
                <Routes>
                    <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    {user ? (
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/MyProfile" element={<MyProfile />} />
                            <Route path="/ModifyUser" element={<ModifyUser />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/post/:postId" element={<PostDetails />} />
                        </>
                    ) : (
                        <Route path="/login" element={<Login />} />
                    )}
                </Routes>
            </Container>
            <div className="container-fluid p-0">
                <Footer />
            </div>
        </>
    );
}

export default AppContent;
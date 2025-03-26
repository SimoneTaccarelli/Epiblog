import './App.css';
import { AuthProvider } from './contexts/AuthContext.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContent from './components/AppContent.js';




function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        </AuthProvider>
      </Router>
    
  );
}

export default App;

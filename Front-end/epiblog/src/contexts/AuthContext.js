import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{
    // Recupera l'utente memorizzato nel localStorage
    const storedUser = localStorage.getItem('user');
    // Restituisce l'utente se presente, altrimenti null
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [updateProfile, setUpdateProfile] = useState([]);



  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    console.log('userCotext', user );
  }, []);

  

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout , setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
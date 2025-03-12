import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Recupera l'utente memorizzato nel localStorage
    const storedUser = localStorage.getItem('user');
    console.log('storedUser', storedUser);
    // Restituisce l'utente se presente, altrimenti null
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    console.log('userCotext', user);
  }, []); // Dipendenza vuota per eseguire l'effetto solo una volta

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (newUserData) => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Aggiorna solo i campi necessari
      const updatedUser = {
        ...parsedUser,
        ...newUserData.user // Estrai solo i dati dell'utente dalla risposta del server
      };
      
      setUser(updatedUser); // Aggiorna lo stato user
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Aggiorna il localStorage
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    
    // Recupera l'utente memorizzato nel localStorage
    const storedUser = localStorage.getItem('user');
    console.log('storedUser', storedUser);
    // Restituisce l'utente se presente, altrimenti null
    return storedUser ? JSON.parse(storedUser) : null;
  });
  // Aggiungi lo stato del token
  const[token, setToken] = useState(() => {
    // Recupera il token memorizzato nel localStorage
    return localStorage.getItem('token');
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Aggiorna il localStorage con i dati dell'utente
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      // Aggiorna lo stato user con i dati memorizzati
      setUser(JSON.parse(storedUser));
    }
    console.log('userCotext', user);
  }, []); // Dipendenza vuota per eseguire l'effetto solo una volta

  // Aggiungi la funzione di login
  const login = (userData , userToken) => {
    // Imposta lo stato user con i dati dell'utente
    setUser(userData);
    // Imposta lo stato token con il token
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
    <AuthContext.Provider value={{ token, user, login, logout, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
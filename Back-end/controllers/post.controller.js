import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import axios from 'axios'; // Per le chiamate API a Google

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function authMiddleware(req, res, next) {
    try {
        // Verifica header di autorizzazione
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Non sei autenticato" });
        }
        
        // Estrai il token
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Token non fornito" });
        }
        
        // Determina se è un token Google o JWT standard
        if (token.includes('google-oauth2|')) {
            // Logica per token Google
            try {
                // Verifica il token con l'API di Google
                const googleResponse = await axios.get(
                    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
                );
                
                if (!googleResponse.data) {
                    return res.status(401).json({ message: "Token Google non valido" });
                }
                
                // Trova l'utente nel tuo database basato sull'email di Google
                const user = await User.findOne({ email: googleResponse.data.email });
                
                if (!user) {
                    return res.status(401).json({ message: "Utente Google non trovato" });
                }
                
                // Aggiungi info utente alla request
                req.user = {
                    _id: user._id,
                    email: user.email
                };
                
                next();
            } catch (error) {
                console.error("Errore verifica token Google:", error);
                return res.status(401).json({ message: "Token Google non valido" });
            }
        } else {
            // Logica per JWT standard
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                
                const user = await User.findById(decoded._id);
                if (!user) {
                    return res.status(401).json({ message: "Utente non trovato" });
                }
                
                // Aggiungi info utente alla request
                req.user = {
                    _id: decoded._id,
                    email: decoded.email
                };
                
                next();
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Token scaduto" });
                }
                return res.status(401).json({ message: "Token non valido" });
            }
        }
    } catch (error) {
        console.error("Errore nel middleware di autenticazione:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
}


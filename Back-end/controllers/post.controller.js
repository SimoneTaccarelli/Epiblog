import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Non sei autenticato" });
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Token non fornito" });
        }
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Aggiungi le informazioni dell'utente alla request
            req.user = {
                _id: decoded._id,
                email: decoded.email
            };
            
            next();
        } catch (error) {
            return res.status(401).json({ message: "Token non valido" });
        }
    } catch (error) {
        console.error("Errore nel middleware di autenticazione:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
}


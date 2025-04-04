import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// In controllers/post.controller.js
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
            
            // Non verifichiamo l'utente nel database, usiamo solo i dati dal token
            req.user = {
                _id: decoded._id,
                email: decoded.email
            };
            
            next();
        } catch (jwtError) {
            return res.status(401).json({ message: "Token non valido" });
        }
    } catch (error) {
        res.status(500).json({ message: "Errore interno del server" });
    }
}


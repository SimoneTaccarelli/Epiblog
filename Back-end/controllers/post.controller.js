import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assicurati di avere il modello User corretto
import dotenv from 'dotenv';

dotenv.config();

// Sostituisci con la tua chiave segreta JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function authMiddleware(req, res, next) {
    try {
        // Verifica se è presente l'header di autorizzazione
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Non sei autenticato" });
        }
        
        // Estrai il token
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Token non fornito" });
        }
        
        // Verifica e decodifica il token
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Opzionale: verifica che l'utente esista ancora nel database
            const user = await User.findById(decoded._id);
            if (!user) {
                return res.status(401).json({ message: "Utente non trovato" });
            }
            
            // Aggiungi le informazioni dell'utente alla request
            req.user = {
                _id: decoded._id,
                email: decoded.email,
                // Aggiungi altri campi se necessario
            };
            
            // Passa al prossimo middleware o controller
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token scaduto, effettua nuovamente il login" });
            }
            return res.status(401).json({ message: "Token non valido" });
        }
    } catch (error) {
        console.error("Errore nel middleware di autenticazione:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
}


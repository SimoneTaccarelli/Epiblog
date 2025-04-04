import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware che bypassa l'autenticazione
export async function authMiddleware(req, res, next) {
    // Imposta un utente fittizio per tutte le richieste
    req.user = {
        _id: "admin", // ID fittizio che verrà usato per tutte le operazioni
        email: "admin@example.com"
    };
    
    // Prosegui con la richiesta senza controlli
    next();
}


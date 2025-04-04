import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Usa una chiave segreta fissa per il debug
const JWT_SECRET = "your-secret-key"; // Rimuovi la variabile d'ambiente temporaneamente

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
            console.log("Verifico token con chiave:", JWT_SECRET);
            
            // Per il debug, decodifica senza verificare
            let decoded;
            try {
                // Questa parte decodifica il token senza verificare la firma
                const base64Payload = token.split('.')[1];
                const payload = Buffer.from(base64Payload, 'base64');
                decoded = JSON.parse(payload.toString());
                console.log("Token decodificato (senza verifica):", decoded);
            } catch (e) {
                console.error("Errore decodifica base64:", e);
            }
            
            // Adesso verifica con la firma
            decoded = jwt.verify(token, JWT_SECRET);
            
            // Aggiungi le informazioni dell'utente alla request
            req.user = {
                _id: decoded._id,
                email: decoded.email
            };
            
            next();
        } catch (error) {
            console.error("Errore JWT:", error.name, error.message);
            return res.status(401).json({ message: `Token non valido: ${error.message}` });
        }
    } catch (error) {
        console.error("Errore nel middleware di autenticazione:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
}


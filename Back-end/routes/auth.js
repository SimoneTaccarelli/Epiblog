import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/Users.js';
import upload from '../utilities/cloudinary.js';

const router = express.Router();

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

router.post('/login/local', async (req, res,next) => {
    passport.authenticate('local',(err, user, info) => {
        if(err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ message: info.message });
        }

        const token = generateToken(user);
        const userToSend = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        }
        return res.status(200).json({ user: userToSend, token });
    })(req, res, next);
});  

router.post('/register', upload.single('profilePic'), async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        
        if (req.file) {
            newUser.profilePic = req.file.path;}
        
        await newUser.save();
     
        const userToSend = {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
        }
        if (req.file) {
            userToSend.profilePic = newUser.profilePic;}
        const token = generateToken(newUser);
        res.status(201).json({ user: userToSend, token });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Invio dell'oggetto errore completo
    }
});

//login google
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/login/google-callback', passport.authenticate('google', { 
    failureRedirect: '/login' 
}), (req, res) => {
    try {
        const token = generateToken(req.user);
        res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
    } catch (error) {
        console.error('Errore nel generare token:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
});

export default router;
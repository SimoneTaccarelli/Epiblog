import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/Users.js';
import upload from '../utilities/cloudinary.js';
import mailer from '../helper/mailer.js';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

router.post('/login/local', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
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
    // salvo l'utente nel database
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    // Se è stata caricata un'immagine, la salvo nel database
    if (req.file) {
      newUser.profilePic = req.file.path;
    }

    await newUser.save();
    await mailer.sendMail({
      from: 'simone-taccarelli@hotmail.it',
      to: newUser.email,
      subject: "Welcome to Epiblog",
      text: "You have successfully registered to Epiblog",
      html: `<h1>Welcome to Epiblog ${newUser.firstName} </h1>`,
    });
    // Invio solo i dati necessari al front-end
    const userToSend = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    }
    // se è stata caricata un'immagine, la invio al front-end
    if (req.file) {
      userToSend.profilePic = newUser.profilePic;
    }

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
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);

  } catch (error) {
    console.error('Errore nel generare token:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
  }
});

//end point me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

//update
router.put('/:userId', upload.single('profilePic'), async (req, res) => {
  try {
    // Estrae i dati dal corpo della richiesta
    const { firstName, lastName, email } = req.body;

    // Crea un oggetto con i dati da aggiornare
    const updateData = { firstName, lastName, email };

    // Estrae l'ID dell'utente dai parametri della richiesta
    const { userId } = req.params;

    // Aggiorna solo i campi forniti
    if (req.file) {
      updateData.profilePic = req.file.path;
    }

    // Trova l'utente per ID e aggiorna i dati
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true } // Restituisce il documento aggiornato
    ).select("-password"); // Esclude il campo password dalla risposta

    // Se l'utente non viene trovato, restituisce un errore 404
    if (!userUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Restituisce l'utente aggiornato come risposta
    res.status(200).json({ message: "User updated successfully", user: userUpdate });
  } catch (error) {
    // In caso di errore, restituisce un messaggio di errore
    res.status(400).json({ message: error.message });
  }
});


//update Password
router.put('/:userID/password', async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { userID } = req.params;
    
    // Controlla prima se le password corrispondono
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirmation do not match" });
    }
    
    // Trova l'utente
    const userFound = await User.findById(userID).select('password');
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verifica la vecchia password
    const passwordMatch = await bcrypt.compare(oldPassword, userFound.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    
    // Verifica che la nuova password sia diversa dalla vecchia
    const isSamePassword = await bcrypt.compare(newPassword, userFound.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from the old one" });
    }
    
    // Genera hash della nuova password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Aggiorna la password
    const passwordUpdate = await User.findByIdAndUpdate(
      userID,
      { password: hashedPassword },
      { new: true }
    );
    
    // Invia risposta di successo
    return res.status(200).json({ message: "Password updated successfully" });
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//delete
router.delete('/:userId', async (req, res) => {
  try {
    const { password } = req.body;

    const foundUser = await User.findById(req.params.userId).select('+password');
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!await bcrypt.compare(password, foundUser.password)) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const { userId } = req.params;
    const user = await User
      .findByIdAndDelete(userId)
      .select("-password");


    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
);

//get all users
router.get('/suggested/:usersId', async (req, res) => {
  try {
    const { usersId } = req.params;
    const users = await User.find({ _id: { $ne: usersId } }).select('-password');


    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
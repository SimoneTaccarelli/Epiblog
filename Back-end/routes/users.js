import e from "express";
import User from "../models/Users.js";
import upload from "../utilities/cloudinary.js";

const router = e.Router();

//get
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); //select("-password") is used to exclude the password from the response
    res.json(users);
  } catch (error) {
    res.json({ message: error });
  }
});

//post register
router.post("/register", upload.single('profilePic'), async (req, res) => {
  try {
    const { firstName, lastName, email, password, profilePic } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      profilePic: req.file.path,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//post login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email is wrong" });
    }
    if (user.password !== req.body.password) {
      return res.status(400).json({ message: "Password is wrong" });
    }
    res.json(user);
  } catch (error) {
    res.json({ message: error });
  }
});

//delete
router.delete("/:userId", async (req, res) => {
  try {
    const removedUser = await User.remove({ _id: req.params.userId });
    res.json(removedUser);
  } catch (error) {
    res.json({ message: error });
  }
});

//update
router.put('/:userId', upload.single('profilePic'), async (req, res) => {
  try {
    // Estrae i dati dal corpo della richiesta
    const { firstName, lastName, email, currentPassword, newPassword } = req.body;
    
    // Trova l'utente nel database usando l'ID fornito nei parametri della richiesta
    const user = await User.findById(req.params.userId);
    
    // Se l'utente non viene trovato, restituisce un errore 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Se la password corrente è fornita e non corrisponde alla password dell'utente, restituisce un errore 400
    if (currentPassword && user.password !== currentPassword) {
      return res.status(400).json({ message: "Password is wrong" });
    }

    // Aggiorna solo i campi forniti
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (newPassword) user.password = newPassword;
    if (req.file) {
      user.profilePic = req.file.path;
    }

    // Salva le modifiche nel database
    await user.save();
    
    // Restituisce l'utente aggiornato come risposta
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    // In caso di errore, restituisce un messaggio di errore
    res.status(400).json({ message: error.message });
  }
});

export default router;
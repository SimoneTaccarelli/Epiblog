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
    const{oldPassword, newPassword} = req.body;

    if(oldPassword === newPassword){
      return res.status(400).json({message: "New password must be different from the old one"});
    }

    if(oldPassword ==! oldPassword){
      return res.status(400).json({message: "Old password is wrong"});
    }

    const {id} = req.params;

    const passwordUpdate = await User.findByIdAndUpdate(
      id,
      {password: newPassword},
      {new: true}
    );

    if(!passwordUpdate){
      return res.status(404).json({message: "User not found"});
    }

  
  } catch (error) {
    res.status(400).json({message: error.message});
    
  }});

export default router;
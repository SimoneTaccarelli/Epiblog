import e from "express";
import User from "../models/Users.js";

const router = e.Router();

//get
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");//select("-password") is used to exclude the password from the response
    res.json(users);
  } catch (error) {
    res.json({ message: error });
  }
});

//post register
router.post("/register", async (req, res) => {
  const user = new User({
    firstName: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    res.json({ message: error });
  }
});

//post login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email:
      req.body.email
    });
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

export default router;
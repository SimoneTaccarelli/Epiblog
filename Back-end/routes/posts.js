import e from "express";
import Posts from "../models/Posts.js";

const router = e.Router();

//get
router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find().populate("user", "firstname lastname");//populate is used to get the user's name from the user collection
    res.json(posts);
  } catch (error) {
    res.json({ message: error });
  }
});

//get single post
router.get("/:Id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.Id).populate("user", "firstname lastname");
    res.json(post);
  } catch (error) {
    res.json({ message: error });
  }
});

//post
router.post("/:Id", async (req, res) => {
    try {
    const {title , category , cover , description , readTime} = req.body;
    const newPost = new Posts({
    title,
    category,
    cover,
    description,
    readTime,
  });
    await newPost.save();
    res.json(newPost);
  } catch (error) {
    res.json({ message: error });
  }
});

export default router;
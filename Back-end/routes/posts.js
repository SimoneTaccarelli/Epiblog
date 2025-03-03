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
router.get("/", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.Id).populate("user", "firstname lastname");
    res.json(post);
  } catch (error) {
    res.json({ message: error });
  }
});

//post
router.post("/", async (req, res) => {
    try {
    const {title , category , cover , description , readTime , author} = req.body;
    const newPost = new Posts({
    title,
    category,
    cover,
    description,
    readTime,
    author
  });
    const savedpost = await newPost.save();

    const populatePost= await Posts.findById(savedpost._id).populate("user", "firstname lastname");
    res.status(201).json(populatePost);
  } catch (error) {
    res.json({ message: error });
  }
});

export default router;
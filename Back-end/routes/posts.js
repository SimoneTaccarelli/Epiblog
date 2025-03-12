import e from "express";
import Posts from "../models/Posts.js";
import upload from "../utilities/cloudinary.js";

const router = e.Router();

//get
router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find().populate("author", "firstName lastName profilePic");//populate is used to get the user's name from the user collection

    const filterAuthor = req.query.author ? posts.filter(post => post.author._id === req.query.author) : posts;
    
    res.status(201).json(posts);
  } catch (error) {
    res.json({ message: error });
  }
});

//get single post
/* router.get("/:Id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.Id).populate("author", "firstname lastname");
    res.json(post);
  } catch (error) {
    res.json({ message: error });
  }
}); */

//post
router.post("/", upload.single('cover'),  async (req, res) => {
    try {
    const {title , category , cover , description , readTime , author} = req.body;
    const newPost = new Posts({
    title,
    category,
    cover : req.file.path,
    description,
    readTime : JSON.parse(readTime),
    author
  });
    const savedpost = await newPost.save();

    const populatePost= await Posts.findById(savedpost._id).populate("user", "firstname lastname");
    res.status(201).json(populatePost);
  } catch (error) {
    res.json({ message: error });
  }
});

//delet post
router.delete("/:postId", async (req, res) => {
  try {
    const post = await Posts.findByIdAndDelete(req.params.postId);
    const deletPost= await post.save();
    res.json(post);
  } catch (error) {
    res.status(201).json({ message: error });
  }
});

//update post
router.put("/:postId", async (req, res) => {
  try {
    const post = await Posts.findByIdAndUpdate(req.params.postId, req.body, { new: true });

    const modifyPost = await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.json({ message: error });
  }
});
export default router;